import type { HtmlTagDescriptor, Plugin } from 'vite'
import { mkdirSync } from 'node:fs'

interface FontFallback {
  font: string
  sizeAdjust: string
  ascentOverride: string
  descentOverride: string
  lineGapOverride?: string
}

interface FontFamily {
  name: string
  weights: string
  preload?: boolean
  fallback?: FontFallback
}

interface Options {
  families: FontFamily[]
  subsets?: string[]
  display?: string
  outDir?: string
}

interface ResolvedFont {
  family: string
  subset: string
  weight: string
  fileName: string
  unicodeRange: string
}

interface ParsedBlock {
  family: string
  subset: string
  weight: string
  url: string
  unicodeRange: string
}

const VIRTUAL_ID = 'virtual:google-fonts'
const RESOLVED_ID = '\0virtual:google-fonts.css'

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-')
}

async function readMaybe(path: string) {
  try {
    return await Bun.file(path).text()
  } catch {
    return null
  }
}

function parseGoogleFontsCSS(css: string): ParsedBlock[] {
  const blocks: ParsedBlock[] = []
  const re = /\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*\{([^}]+)\}/g
  for (const m of css.matchAll(re)) {
    const subset = m[1]
    const body = m[2]
    const family = body.match(/font-family:\s*'([^']+)';/)?.[1]
      ?? body.match(/font-family: ([^;\s]+)/)?.[1]
    const weight = body.match(/font-weight:\s*([^;]+)/)?.[1]?.trim()
    const url = body.match(/url\(([^)]+)\)/)?.[1]
    const unicodeRange = body.match(/unicode-range:\s*([^;]+)/)?.[1]?.trim()
    if (family && weight && url && unicodeRange) {
      blocks.push({ family, subset, weight, url, unicodeRange })
    }
  }
  return blocks
}

export default function googleFonts(opts: Options): Plugin {
  const subsets = opts.subsets ?? ['latin', 'latin-ext']
  const display = opts.display ?? 'swap'
  const outDir = opts.outDir ?? 'public/fonts'

  let resolved: ResolvedFont[] = []

  return {
    name: 'google-fonts',
    enforce: 'pre',

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },

    load(id) {
      if (id !== RESOLVED_ID) return

      let css = ''
      for (const fam of opts.families) {
        if (!fam.fallback) continue
        const f = fam.fallback
        css += `@font-face {\n  font-family: '${fam.name} Fallback';\n  src: local('${f.font}');\n  size-adjust: ${f.sizeAdjust};\n  ascent-override: ${f.ascentOverride};\n  descent-override: ${f.descentOverride};\n  line-gap-override: ${f.lineGapOverride ?? '0%'};\n}\n`
      }
      for (const f of resolved) {
        css += `@font-face {\n  font-family: '${f.family}';\n  font-style: normal;\n  font-weight: ${f.weight};\n  font-display: ${display};\n  src: url('/fonts/${f.fileName}') format('woff2');\n  unicode-range: ${f.unicodeRange};\n}\n`
      }
      return css
    },

    async buildStart() {
      mkdirSync(outDir, { recursive: true })

      const cssMetaPath = `${outDir}/.css.meta`
      const families = opts.families
        .map(f => `family=${f.name.replace(/ /g, '+')}:wght@${f.weights}`)
        .join('&')
      const url = `https://fonts.googleapis.com/css2?${families}&display=${display}`

      let css: string | null = null
      try {
        const res = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36' },
        })
        if (res.ok) {
          css = await res.text()
          await Bun.write(cssMetaPath, css)
        }
      } catch { /* offline — fall through to cache */ }

      if (!css) {
        css = await readMaybe(cssMetaPath)
        if (!css) throw new Error('google-fonts: no network and no cached CSS — run a build online first')
        console.warn('[google-fonts] offline — using cached font CSS')
      }

      const blocks = parseGoogleFontsCSS(css)
        .filter(b => subsets.includes(b.subset))

      resolved = await Promise.all(blocks.map(async (block) => {
        const fileName = `${slugify(block.family)}-${block.subset}.woff2`
        const targetPath = `${outDir}/${fileName}`
        const metaPath = `${outDir}/.${fileName}.meta`

        if (!(await readMaybe(metaPath) === block.url && await Bun.file(targetPath).exists())) {
          const r = await fetch(block.url)
          if (!r.ok) throw new Error(`google-fonts: ${block.url} → ${r.status}`)
          await Bun.write(targetPath, new Uint8Array(await r.arrayBuffer()))
          await Bun.write(metaPath, block.url)
        }

        return {
          family: block.family,
          subset: block.subset,
          weight: block.weight,
          fileName,
          unicodeRange: block.unicodeRange,
        }
      }))
    },

    transformIndexHtml() {
      const preloadFamilies = opts.families.filter(f => f.preload !== false)
      return resolved
        .filter(f => f.subset === 'latin' && preloadFamilies.some(fam => fam.name === f.family))
        .map<HtmlTagDescriptor>(f => ({
          tag: 'link',
          attrs: { rel: 'preload', href: `/fonts/${f.fileName}`, as: 'font', type: 'font/woff2', crossorigin: true },
          injectTo: 'head-prepend',
        }))
    },
  }
}
