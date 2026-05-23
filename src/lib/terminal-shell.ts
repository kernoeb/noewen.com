import type { Project } from '@/types'
import { projects } from '@/data/projects'

// ---------- Types ----------

export interface Segment {
  text: string
  class?: string
  href?: string
}

export type Line = Segment[]

export interface OutputBlock {
  id: number
  cwd: string
  command: string
  lines: Line[]
}

export interface ExecuteResult {
  lines: Line[]
  clear?: boolean
  openCV?: boolean
}

export type CompletionAction
  = | { kind: 'none' }
    | { kind: 'replace', newInput: string }
    | { kind: 'show', echo: string, lines: Line[] }

// ---------- Constants ----------

export const CWD = '~/Projects'
const HOME_ABS = '/home/noewen'
const CWD_ABS = '/home/noewen/Projects'

const COMMAND_NAMES = ['whoami', 'id', 'ls', 'cat', 'help', 'clear', 'pwd', 'uname', 'cv']
const FILE_COMMANDS = new Set(['cat', 'ls'])

/* Static directory ancestors of CWD. Powers both tab-completion traversal
 * (`ls ~<Tab>` descends into Projects/) and ls/cat operand resolution
 * (`ls ~` lists the home dir's subdirs, `cat /home/noewen` says
 * "Is a directory"). */
const STATIC_SUBDIRS: Record<string, string[]> = {
  '/': ['home'],
  '/home': ['noewen'],
  '/home/noewen': ['Projects'],
}
const LONG_FLAGS_BY_CMD: Record<string, string[]> = {
  ls: ['--all', '--help', '--human-readable', '--reverse'],
  cat: ['--help'],
}
const LS_LONG_ALIASES: Record<string, string> = {
  'all': 'a',
  'human-readable': 'h',
  'reverse': 'r',
}

// ---------- Virtual filesystem ----------

interface VFile {
  name: string
  hidden: boolean
  size: number
  /* Days-ago offset rather than a frozen Date — mtime is computed at use
   * time so dates stay consistent with the user's wall clock even if the
   * tab has been open for hours or days. */
  dayOffset: number
  url?: string
  body: () => Line[]
}

function fakeStats(seed: string) {
  let h = 0
  for (const c of seed) h = ((h * 31 + c.charCodeAt(0)) >>> 0)
  const size = 400 + (h % 4200)
  const dayOffset = h % 120
  return { size, dayOffset }
}

function vfileMtime(f: VFile): Date {
  return new Date(Date.now() - f.dayOffset * 86_400_000)
}

function projectMarkdown(p: Project): Line[] {
  return [
    [{ text: `# ${p.title}`, class: 'md-h1' }],
    [],
    [{ text: p.description }],
    [],
    [{ text: 'Tech: ', class: 'dim' }, { text: p.technologies.join(', '), class: 'value' }],
    [{ text: 'URL:  ', class: 'dim' }, { text: p.url, class: 'link', href: p.url }],
  ]
}

const vfs: VFile[] = []
for (const p of projects) {
  const { size, dayOffset } = fakeStats(p.slug)
  vfs.push({
    name: `${p.slug}.md`,
    hidden: false,
    size,
    dayOffset,
    url: p.url,
    body: () => projectMarkdown(p),
  })
}
{
  const { size, dayOffset } = fakeStats('about')
  vfs.push({
    name: '.about.md',
    hidden: true,
    size,
    dayOffset,
    body: () => [
      [{ text: '# whoami', class: 'md-h1' }],
      [],
      [{ text: 'Noéwen Boisnard, développeur fullstack.' }],
      [{ text: 'Côté front : ' }, { text: 'Vue', class: 'value' }, { text: '. Côté back : ' }, { text: 'Rust, Bun, Node', class: 'value' }, { text: '.' }],
      [{ text: 'Le reste est sur ' }, { text: 'github.com/kernoeb', class: 'link', href: 'https://github.com/kernoeb' }, { text: '.' }],
    ],
  })
}
{
  const { size, dayOffset } = fakeStats('contact')
  vfs.push({
    name: '.contact.md',
    hidden: true,
    size,
    dayOffset,
    body: () => [
      [{ text: '# Contact', class: 'md-h1' }],
      [],
      [{ text: 'GitHub:   ', class: 'dim' }, { text: 'github.com/kernoeb', class: 'link', href: 'https://github.com/kernoeb' }],
      [{ text: 'LinkedIn: ', class: 'dim' }, { text: 'linkedin.com/in/noéwen-boisnard', class: 'link', href: 'https://www.linkedin.com/in/noéwen-boisnard' }],
    ],
  })
}

// ---------- Path resolution ----------

function resolvePath(input: string): string {
  let s = input || '.'
  if (s === '~') s = HOME_ABS
  else if (s.startsWith('~/')) s = HOME_ABS + s.slice(1)
  if (!s.startsWith('/')) s = `${CWD_ABS}/${s}`
  const parts: string[] = []
  for (const seg of s.split('/')) {
    if (seg === '' || seg === '.') continue
    if (seg === '..') parts.pop()
    else parts.push(seg)
  }
  return `/${parts.join('/')}`
}

interface DirEntry { name: string, isDir: boolean, file?: VFile }

function listDir(absPath: string, includeHidden: boolean): DirEntry[] {
  const subdirs: DirEntry[] = (STATIC_SUBDIRS[absPath] ?? []).map(name => ({ name, isDir: true }))
  if (absPath === CWD_ABS) {
    const files = vfs
      .filter(f => includeHidden || !f.hidden)
      .map(f => ({ name: f.name, isDir: false, file: f }))
    return [...subdirs, ...files]
  }
  return subdirs
}

type OperandResolution
  = | { kind: 'cwd' }
    | { kind: 'file', file: VFile }
    | { kind: 'ancestor', subdirs: string[] }
    | { kind: 'error' }

function resolveOperand(o: string): OperandResolution {
  const abs = resolvePath(o)
  if (abs === CWD_ABS) return { kind: 'cwd' }
  if (abs.startsWith(`${CWD_ABS}/`)) {
    const rest = abs.slice(CWD_ABS.length + 1)
    if (!rest.includes('/')) {
      const f = vfs.find(v => v.name === rest)
      if (f) return { kind: 'file', file: f }
    }
  }
  const subdirs = STATIC_SUBDIRS[abs]
  if (subdirs) return { kind: 'ancestor', subdirs }
  return { kind: 'error' }
}

// ---------- Flag parsing ----------

function parseFlags(args: string[]) {
  const flags = new Set<string>()
  const longFlags = new Set<string>()
  const operands: string[] = []
  let afterDashDash = false
  for (const a of args) {
    if (afterDashDash) {
      operands.push(a)
      continue
    }
    if (a === '--') {
      afterDashDash = true
      continue
    }
    if (a.startsWith('--') && a.length > 2) {
      longFlags.add(a.slice(2))
    } else if (a.startsWith('-') && a.length > 1) {
      for (const ch of a.slice(1)) flags.add(ch)
    } else {
      operands.push(a)
    }
  }
  return { flags, longFlags, operands }
}

// ---------- Formatting helpers ----------

function formatSize(bytes: number, human: boolean): string {
  if (!human) return String(bytes)
  if (bytes < 1024) return `${bytes}`
  const k = bytes / 1024
  if (k < 10) return `${k.toFixed(1)}K`
  return `${Math.round(k)}K`
}

function pad(s: string, width: number): string {
  return s.length >= width ? s : ' '.repeat(width - s.length) + s
}

function formatMtime(d: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const m = months[d.getMonth()]
  const day = pad(String(d.getDate()), 2)
  const sixMo = 1000 * 60 * 60 * 24 * 180
  if (Date.now() - d.getTime() > sixMo) {
    return `${m} ${day}  ${d.getFullYear()}`
  }
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${m} ${day} ${hh}:${mm}`
}

// ---------- Commands ----------

function lsHelp(): Line[] {
  return [
    [{ text: 'Usage: ls [OPTION]... [FILE]...', class: 'md-h1' }],
    [],
    [{ text: 'List information about the FILEs (the current directory by default).' }],
    [],
    [{ text: '  -a, --all              ', class: 'command' }, { text: 'do not ignore entries starting with .' }],
    [{ text: '  -l                     ', class: 'command' }, { text: 'use a long listing format' }],
    [{ text: '  -h, --human-readable   ', class: 'command' }, { text: 'print sizes like 1.2K, 3.4M' }],
    [{ text: '  -t                     ', class: 'command' }, { text: 'sort by modification time, newest first' }],
    [{ text: '  -r, --reverse          ', class: 'command' }, { text: 'reverse order while sorting' }],
    [{ text: '  -S                     ', class: 'command' }, { text: 'sort by file size, largest first' }],
    [{ text: '      --help             ', class: 'command' }, { text: 'display this help and exit' }],
  ]
}

const VALID_LS_FLAGS = new Set(['a', 'l', 'h', 't', 'r', 'S'])

function cmdLs(args: string[]): Line[] {
  const { flags, longFlags, operands } = parseFlags(args)

  if (longFlags.has('help')) return lsHelp()

  for (const lf of longFlags) {
    const short = LS_LONG_ALIASES[lf]
    if (short) {
      flags.add(short)
    } else {
      return [
        [{ text: `ls: unrecognized option '--${lf}'`, class: 'err' }],
        [{ text: 'Try \'ls --help\' for more information.', class: 'dim' }],
      ]
    }
  }

  // Validate short flags too — symmetric with the long-flag check above
  // so `ls -L` (typo for -l) doesn't silently produce non-long output.
  for (const f of flags) {
    if (!VALID_LS_FLAGS.has(f)) {
      return [
        [{ text: `ls: invalid option -- '${f}'`, class: 'err' }],
        [{ text: 'Try \'ls --help\' for more information.', class: 'dim' }],
      ]
    }
  }

  const resolutions = operands.map(o => ({ raw: o, res: resolveOperand(o) }))
  const bad = resolutions.find(r => r.res.kind === 'error')
  if (bad) {
    return [[{ text: `ls: cannot access '${bad.raw}': No such file or directory`, class: 'err' }]]
  }

  const fileOperands: VFile[] = []
  let hasCwd = operands.length === 0
  const ancestorNames = new Set<string>()
  for (const r of resolutions) {
    if (r.res.kind === 'cwd') hasCwd = true
    else if (r.res.kind === 'file') fileOperands.push(r.res.file)
    else if (r.res.kind === 'ancestor') r.res.subdirs.forEach(s => ancestorNames.add(s))
  }

  // Pure ancestor listings (`ls ~`, `ls /`, `ls /home/noewen`) render the
  // static subdir tree as directory entries.
  if (!hasCwd && fileOperands.length === 0 && ancestorNames.size > 0) {
    const names = [...ancestorNames].sort()
    if (flags.has('r')) names.reverse()
    if (!flags.has('l')) {
      const segs: Segment[] = []
      names.forEach((name, i) => {
        segs.push({ text: `${name}/`, class: 'dim' })
        if (i < names.length - 1) segs.push({ text: '  ' })
      })
      return [segs]
    }
    return names.map(name => [
      { text: 'drwxr-xr-x ', class: 'dim' },
      { text: `${name}/`, class: 'dim' },
    ])
  }

  let items = hasCwd || fileOperands.length === 0
    ? vfs.filter(f => flags.has('a') || !f.hidden)
    : fileOperands

  if (flags.has('S')) items = [...items].sort((a, b) => b.size - a.size)
  else if (flags.has('t')) items = [...items].sort((a, b) => a.dayOffset - b.dayOffset)
  else items = [...items].sort((a, b) => a.name.localeCompare(b.name))
  if (flags.has('r')) items.reverse()

  if (!flags.has('l')) {
    const segs: Segment[] = []
    items.forEach((f, i) => {
      const cls = f.hidden ? 'dim-file' : (f.url ? 'file-link' : 'file')
      segs.push({ text: f.name, class: cls, href: f.url })
      if (i < items.length - 1) segs.push({ text: '  ' })
    })
    return [segs]
  }

  const human = flags.has('h')
  const owner = 'noewen'
  const total = items.reduce((acc, f) => acc + Math.ceil(f.size / 512), 0)
  const lines: Line[] = []
  lines.push([{ text: `total ${total}`, class: 'dim' }])
  const sizeStrs = items.map(f => formatSize(f.size, human))
  const maxSize = Math.max(1, ...sizeStrs.map(s => s.length))

  items.forEach((f, i) => {
    const sz = pad(sizeStrs[i]!, maxSize)
    const meta = `-rw-r--r-- 1 ${owner} ${owner} ${sz} ${formatMtime(vfileMtime(f))} `
    const segs: Segment[] = [{ text: meta, class: 'dim' }]
    const cls = f.hidden ? 'dim-file' : (f.url ? 'file-link' : 'file')
    segs.push({ text: f.name, class: cls, href: f.url })
    lines.push(segs)
  })
  return lines
}

function cmdCat(args: string[]): Line[] {
  const { longFlags, operands } = parseFlags(args)

  if (longFlags.has('help')) {
    return [
      [{ text: 'Usage: cat [OPTION]... [FILE]...', class: 'md-h1' }],
      [],
      [{ text: 'Concatenate FILE(s) to standard output.' }],
      [],
      [{ text: '      --help             ', class: 'command' }, { text: 'display this help and exit' }],
    ]
  }

  const firstLong = [...longFlags][0]
  if (firstLong !== undefined) {
    return [
      [{ text: `cat: unrecognized option '--${firstLong}'`, class: 'err' }],
      [{ text: 'Try \'cat --help\' for more information.', class: 'dim' }],
    ]
  }

  if (!operands.length) return [[{ text: 'cat: missing operand', class: 'err' }]]
  const result: Line[] = []
  for (const target of operands) {
    const res = resolveOperand(target)
    if (res.kind === 'cwd' || res.kind === 'ancestor') {
      result.push([{ text: `cat: ${target}: Is a directory`, class: 'err' }])
      continue
    }
    if (res.kind === 'error') {
      result.push([{ text: `cat: ${target}: No such file or directory`, class: 'err' }])
      continue
    }
    if (result.length > 0) result.push([])
    result.push(...res.file.body())
  }
  return result
}

function cmdHelp(): Line[] {
  return [
    [{ text: 'Available commands:', class: 'md-h1' }],
    [],
    [{ text: '  whoami       ', class: 'command' }, { text: 'who is in front of you' }],
    [{ text: '  id           ', class: 'command' }, { text: 'effective user info' }],
    [{ text: '  ls [-lahtrS] ', class: 'command' }, { text: 'list projects (try ' }, { text: 'ls -laht', class: 'value' }, { text: ')' }],
    [{ text: '  cat FILE     ', class: 'command' }, { text: 'open a file (e.g. ' }, { text: 'cat planningsup.md', class: 'value' }, { text: ')' }],
    [{ text: '  pwd          ', class: 'command' }, { text: 'where am I?' }],
    [{ text: '  uname [-a]   ', class: 'command' }, { text: 'system info' }],
    [{ text: '  cv           ', class: 'command' }, { text: 'open the CV' }],
    [{ text: '  clear        ', class: 'command' }, { text: 'wipe the screen' }],
    [{ text: '  help         ', class: 'command' }, { text: 'this thing' }],
  ]
}

// ---------- Execute ----------

// Lightweight tokenizer: handles single + double quotes so filenames with
// whitespace remain reachable (`cat "my notes.md"`). No escapes, no
// variable expansion — this is decorative, not a real shell.
function tokenize(s: string): string[] {
  const tokens: string[] = []
  let current = ''
  let active: '"' | '\'' | null = null
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (active) {
      if (c === active) {
        active = null
        continue
      }
      current += c
    } else if (c === '"' || c === '\'') {
      active = c
    } else if (/\s/.test(c)) {
      if (current) {
        tokens.push(current)
        current = ''
      }
    } else {
      current += c
    }
  }
  if (current) tokens.push(current)
  return tokens
}

export function execute(raw: string): ExecuteResult {
  const trimmed = raw.trim()
  if (!trimmed) return { lines: [] }
  const [name, ...args] = tokenize(trimmed)
  switch (name) {
    case 'whoami':
      return { lines: [[{ text: 'noewen' }]] }
    case 'id':
      return { lines: [[{ text: 'uid=1000(noewen) gid=1000(noewen) groups=1000(noewen),27(sudo),100(users),999(devs)' }]] }
    case 'ls':
      return { lines: cmdLs(args) }
    case 'cat':
      return { lines: cmdCat(args) }
    case 'help':
      return { lines: cmdHelp() }
    case 'clear':
      return { lines: [], clear: true }
    case 'pwd':
      return { lines: [[{ text: CWD_ABS }]] }
    case 'uname': {
      const { flags, longFlags } = parseFlags(args)
      const full = flags.has('a') || longFlags.has('all')
      return { lines: [[{ text: full ? 'kernOS 1.0.0 noewen-mbp Darwin x86_64' : 'kernOS' }]] }
    }
    case 'cv':
      return { lines: [[{ text: 'opening CV…', class: 'dim' }]], openCV: true }
    case 'sudo':
      return { lines: [[
        { text: 'sudo: noewen is not in the sudoers file. This incident will be reported.', class: 'err' },
        { text: ' (no)', class: 'dim' },
      ]] }
    case 'cd': {
      const target = args[0]
      // No-op self-references: `.`, `./`, `././`, `./././` — collapse to nothing.
      const collapsed = target && !target.startsWith('/')
        ? target.split('/').filter(p => p.length > 0 && p !== '.')
        : null
      if (collapsed && collapsed.length === 0) return { lines: [] }
      return { lines: [[{ text: `cd: ${target ?? '~'}: Permission denied`, class: 'err' }]] }
    }
    case 'rm':
      return { lines: [[{ text: `rm: cannot remove '${args[0] ?? ''}': Permission denied`, class: 'err' }]] }
    case 'man':
      return { lines: [[{ text: `No manual entry for ${args[0] ?? ''}`, class: 'err' }]] }
    default:
      return { lines: [[{ text: `kersh: ${name}: command not found`, class: 'err' }]] }
  }
}

// ---------- Tab completion ----------

function longestCommonPrefix(strs: string[]): string {
  if (!strs.length) return ''
  let prefix = strs[0] ?? ''
  for (let i = 1; i < strs.length; i++) {
    while (!strs[i]!.startsWith(prefix)) {
      prefix = prefix.slice(0, -1)
      if (!prefix) return ''
    }
  }
  return prefix
}

function candidateSegment(name: string): Segment {
  if (COMMAND_NAMES.includes(name)) return { text: name, class: 'command' }
  if (name.endsWith('/')) return { text: name, class: 'dim' }
  const base = name.split('/').pop() ?? name
  const f = vfs.find(v => v.name === base)
  if (!f) return { text: name }
  return { text: name, class: f.hidden ? 'dim-file' : (f.url ? 'file-link' : 'file') }
}

/**
 * Pure completion logic. Caller decides what to do with the returned action:
 * - 'none'    → no completion possible; let the Tab key escape to the next focusable element.
 * - 'replace' → overwrite the input with newInput.
 * - 'show'    → multiple candidates with no further common prefix; render the candidate line as terminal output.
 */
export function computeCompletion(input: string, shiftKey: boolean): CompletionAction {
  if (shiftKey) return { kind: 'none' }

  const endsWithSpace = /\s$/.test(input)
  const trimmedTokens = input.trim().length ? tokenize(input.trim()) : []

  let prefix = ''
  let candidates: string[] = []
  let replaceFrom = input.length

  if (trimmedTokens.length === 0 || (trimmedTokens.length === 1 && !endsWithSpace)) {
    prefix = trimmedTokens[0] ?? ''
    candidates = COMMAND_NAMES.filter(c => c.startsWith(prefix))
    replaceFrom = input.length - prefix.length
  } else {
    const cmd = trimmedTokens[0]
    if (!cmd) return { kind: 'none' }
    const lastWord = endsWithSpace ? '' : (trimmedTokens[trimmedTokens.length - 1] ?? '')
    replaceFrom = input.length - lastWord.length
    prefix = lastWord
    if (lastWord.startsWith('--')) {
      const longFlags = LONG_FLAGS_BY_CMD[cmd] ?? []
      candidates = longFlags.filter(f => f.startsWith(lastWord))
    } else if (FILE_COMMANDS.has(cmd)) {
      if (lastWord === '~') {
        // Bare `~` only resolves to the home dir — offer `~/` so the next
        // Tab can descend into it.
        candidates = ['~/']
      } else if (lastWord.includes('/') || lastWord.startsWith('~')) {
        const lastSlash = lastWord.lastIndexOf('/')
        const dirPart = lastWord.slice(0, lastSlash + 1)
        const partial = lastWord.slice(lastSlash + 1)
        const dirAbs = resolvePath(dirPart || '.')
        const includeHidden = partial.startsWith('.')
        candidates = listDir(dirAbs, includeHidden)
          .filter(e => e.name.startsWith(partial))
          .map(e => `${dirPart}${e.name}${e.isDir ? '/' : ''}`)
      } else {
        const includeHidden = lastWord.startsWith('.')
        const names = vfs.filter(f => includeHidden || !f.hidden).map(f => f.name)
        candidates = names.filter(n => n.startsWith(lastWord))
      }
    } else {
      return { kind: 'none' }
    }
  }

  if (candidates.length === 0) return { kind: 'none' }

  if (candidates.length === 1) {
    const c = candidates[0]!
    const suffix = c.endsWith('/') ? '' : ' '
    return { kind: 'replace', newInput: `${input.slice(0, replaceFrom)}${c}${suffix}` }
  }

  const lcp = longestCommonPrefix(candidates)
  if (lcp.length > prefix.length) {
    return { kind: 'replace', newInput: `${input.slice(0, replaceFrom)}${lcp}` }
  }

  const segs: Segment[] = []
  candidates.forEach((name, i) => {
    if (i > 0) segs.push({ text: '  ' })
    segs.push(candidateSegment(displayName(name)))
  })
  return { kind: 'show', echo: input, lines: [segs] }
}

function displayName(full: string): string {
  if (!full.includes('/')) return full
  const hasTrailingSlash = full.endsWith('/')
  const trimmed = hasTrailingSlash ? full.slice(0, -1) : full
  const base = trimmed.split('/').pop() ?? full
  return hasTrailingSlash ? `${base}/` : base
}
