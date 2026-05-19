import type { Plugin } from 'vite'
import { extname } from 'node:path'

interface BuiltIcon {
  cacheKey: string
  build: () => Promise<string>
}

type RemoteIcon
  = | { name: string, url: string, viewBox?: string }
    | ({ name: string } & BuiltIcon)

interface Options {
  icons: RemoteIcon[]
  outDir?: string
  /**
   * When set, raster fetches (anything that isn't `.svg`) are decoded and
   * re-encoded through `Bun.Image` to a uniform format/size. SVG output
   * (from `.svg` urls or `build` callbacks) always stays as SVG.
   */
  rasterize?: { format: 'webp' | 'png', size: number }
}

function extFromUrl(url: string) {
  return extname(new URL(url).pathname).slice(1).toLowerCase() || 'png'
}

async function readMaybe(path: string) {
  try {
    return await Bun.file(path).text()
  } catch {
    return null
  }
}

export default function remoteIcons(opts: Options): Plugin {
  const outDir = opts.outDir ?? 'public/icons'

  async function processIcon(icon: RemoteIcon) {
    const isUrl = 'url' in icon
    const isSvgOutput = !isUrl || extFromUrl(icon.url) === 'svg'
    const targetExt = isSvgOutput ? 'svg' : (opts.rasterize?.format ?? extFromUrl(icon.url))
    const targetPath = `${outDir}/${icon.name}.${targetExt}`
    const metaPath = `${outDir}/.${icon.name}.meta`

    const cacheKey = isUrl
      ? `${icon.url}|${icon.viewBox ?? ''}|${opts.rasterize ? `${opts.rasterize.format}@${opts.rasterize.size}` : 'raw'}`
      : icon.cacheKey

    if (await readMaybe(metaPath) === cacheKey && await Bun.file(targetPath).exists()) return

    let body: string | Uint8Array
    if (isUrl) {
      const res = await fetch(icon.url)
      if (!res.ok) throw new Error(`remote-icons: ${icon.url} → ${res.status}`)
      if (isSvgOutput) {
        const svg = await res.text()
        body = icon.viewBox ? svg.replace(/viewBox="[^"]*"/, `viewBox="${icon.viewBox}"`) : svg
      } else if (opts.rasterize) {
        const img = new Bun.Image(new Uint8Array(await res.arrayBuffer())).resize(opts.rasterize.size, opts.rasterize.size)
        body = await (opts.rasterize.format === 'webp' ? img.webp() : img.png()).bytes()
      } else {
        body = new Uint8Array(await res.arrayBuffer())
      }
    } else {
      body = await icon.build()
    }

    await Bun.write(targetPath, body)
    await Bun.write(metaPath, cacheKey)
  }

  return {
    name: 'remote-icons',
    async buildStart() {
      await Promise.all(opts.icons.map(processIcon))
    },
  }
}

/**
 * Build a flat SVG from an Android adaptive icon by merging the foreground
 * vector drawable and the background color resource into a single 108×108
 * SVG. Cache key is derived from the URLs so a warm cache skips the fetches.
 */
export function androidAdaptiveIcon(opts: { foregroundUrl: string, backgroundUrl: string }): BuiltIcon {
  return {
    cacheKey: `android|${opts.foregroundUrl}|${opts.backgroundUrl}`,
    build: async () => {
      const [fg, bg] = await Promise.all([
        fetch(opts.foregroundUrl).then(r => r.text()),
        fetch(opts.backgroundUrl).then(r => r.text()),
      ])
      const color = bg.match(/<color[^>]*>([^<]+)<\/color>/)?.[1]
      if (!color) throw new Error(`androidAdaptiveIcon: no <color> found at ${opts.backgroundUrl}`)
      const paths = [...fg.matchAll(/<path\b[\s\S]*?\/>/g)]
        .map((m) => {
          const fill = m[0].match(/android:fillColor="([^"]+)"/)?.[1]
          const d = m[0].match(/android:pathData="([^"]+)"/)?.[1]
          return fill && d ? `<path fill="${fill}" d="${d}"/>` : ''
        })
        .join('')
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108"><rect width="108" height="108" fill="${color}"/>${paths}</svg>`
    },
  }
}

/**
 * Build an app-icon-style SVG: solid colored background with an MDI glyph
 * centered on top, using the standard MDI 24-unit grid scaled to the 108
 * viewBox with a comfortable inset.
 */
export function mdiAppIcon(opts: { mdiPath: string, bg: string, fg?: string }): BuiltIcon {
  const fg = opts.fg ?? '#FFFFFF'
  // 60% glyph size (scale 2.7), centered → translate by (108 - 24*2.7) / 2 = 21.6
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108"><rect width="108" height="108" fill="${opts.bg}"/><g transform="translate(21.6, 21.6) scale(2.7)"><path d="${opts.mdiPath}" fill="${fg}"/></g></svg>`
  return {
    cacheKey: `mdi|${opts.bg}|${fg}|${opts.mdiPath}`,
    build: async () => svg,
  }
}
