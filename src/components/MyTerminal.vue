<script setup lang="ts">
import type { OutputBlock } from '@/lib/terminal-shell'
import { computeCompletion, CWD, execute } from '@/lib/terminal-shell'

// ---------- Interactive shell state ----------

const isBooting = ref(true)
const currentInput = ref('')
const cursorPos = ref(0)
const cursorActive = ref(false)
const outputBlocks = ref<OutputBlock[]>([])
const cleared = ref(false)
const inputFocused = ref(false)
const isScrolled = ref(false)
const lockedHeight = ref<number | null>(null)
const terminalFullscreen = ref(false)
// Hoisted above the fullscreen handlers so onTerminalKeydown can read it
// in the same scope without a TDZ. Initialized to false; the rest of the
// CV-dialog plumbing lives further down with openCVDialog/watch.
const dialogCV = ref(false)

// Re-anchor the terminal to its last line on fullscreen exit. The card
// has `transition: width 0.2s` — during that 200ms the content width
// interpolates, the lines re-wrap, and scrollHeight is mid-animation.
// We have to wait until the transition completes before scrolling, or
// the browser clamps to a stale max. Use transitionend (precise) with a
// setTimeout fallback in case the event is missed (interrupted toggle,
// reduced-motion suppressing the transition).
function anchorTerminalBottom() {
  let done = false
  function scroll() {
    if (done) return
    done = true
    const el = getScrollEl()
    if (!el) return
    el.scrollTo({
      top: el.scrollHeight,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }
  const card = document.querySelector('.terminal-card')
  if (card) {
    card.addEventListener('transitionend', function handler(e) {
      if ((e as TransitionEvent).propertyName !== 'width') return
      card.removeEventListener('transitionend', handler)
      scroll()
    })
  }
  window.setTimeout(scroll, 260)
}

function toggleTerminalFullscreen() {
  terminalFullscreen.value = !terminalFullscreen.value
  if (!terminalFullscreen.value) anchorTerminalBottom()
}

// Red/yellow on a real macOS chrome destroy/hide the window — neither
// makes sense for an inline terminal that's part of the page. In
// fullscreen they collapse back to the in-page card; out of fullscreen
// they're intentionally inert (the hover-reveal stays for visual parity).
function exitTerminalFullscreen() {
  if (!terminalFullscreen.value) return
  terminalFullscreen.value = false
  anchorTerminalBottom()
}

function onTerminalKeydown(e: KeyboardEvent) {
  // Skip when the CV dialog owns Esc — otherwise one keypress would
  // both close the dialog (via Vuetify) AND collapse the terminal
  // fullscreen, which is two layers of state on one gesture.
  if (e.key === 'Escape' && terminalFullscreen.value && !dialogCV.value) {
    exitTerminalFullscreen()
  }
}

const history = ref<string[]>([])
let historyIndex = -1
let blockId = 0

const cmdInputRef = ref<HTMLInputElement | null>(null)
const terminalScrollRef = ref<HTMLElement | null>(null)

// CV dialog hoisted from BootSession: the `cv` command needs to reach it
// after `clear` (which unmounts BootSession), and we want a single source
// of truth for "user wants to view the CV" regardless of entry point
// (boot button or shell command). dialogCV itself is declared earlier so
// onTerminalKeydown can read it without TDZ.
const dialogCVFullscreen = ref(false)
const supportsPdfViewer = ref(true)

// Captured at openCVDialog so we can restore focus on close (replaces the
// a11y wiring Vuetify's <template #activator> gave us before the hoist).
let cvTriggerEl: HTMLElement | null = null

function openCVDialog() {
  cvTriggerEl = (document.activeElement as HTMLElement | null) ?? null
  if (supportsPdfViewer.value) {
    dialogCV.value = true
  } else {
    // No inline PDF viewer (some mobile browsers) — fall back to a tab.
    window.open('/CV_BOISNARD_Noewen.pdf', '_blank', 'noopener')
  }
}

watch(dialogCV, (open) => {
  if (open) return
  // Always re-windowed on next open — Vuetify keeps fullscreen sticky across
  // open/close cycles otherwise.
  dialogCVFullscreen.value = false
  // Restore focus to whatever opened the dialog. If the trigger was
  // removed from the DOM in the meantime (e.g. boot button after `clear`)
  // fall back to the terminal input so keyboard users don't land on
  // <body> with no obvious way back in.
  if (cvTriggerEl && document.contains(cvTriggerEl)) {
    cvTriggerEl.focus({ preventScroll: true })
  } else {
    cmdInputRef.value?.focus({ preventScroll: true })
  }
  cvTriggerEl = null
})

onMounted(() => {
  const hasPlugin = navigator.pdfViewerEnabled ?? (navigator.mimeTypes?.namedItem('application/pdf') !== null)
  supportsPdfViewer.value = hasPlugin
})

function getScrollEl(): HTMLElement | null {
  return terminalScrollRef.value
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
}

function scrollToBottom() {
  const el = getScrollEl()
  if (!el) return
  el.scrollTo({
    top: el.scrollHeight - el.clientHeight,
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  })
}

function focusInput(e?: MouseEvent) {
  // Don't steal focus from any interactive descendant the user actually
  // clicked — links in command output, the CV dialog activator, vuetify
  // buttons, etc. Bubbling @click on .terminal-pad would otherwise yank
  // focus back to the hidden input the moment the user clicked anything
  // useful.
  if (e?.target instanceof Element
    && e.target.closest('a, button, [role="button"], input, select, textarea')) {
    return
  }
  // preventScroll so an auto-focus (e.g. after the boot loader finishes)
  // doesn't yank the page back to the terminal when the user has scrolled
  // down to read other sections.
  cmdInputRef.value?.focus({ preventScroll: true })
}

function onTerminalScroll() {
  const el = getScrollEl()
  if (!el) return
  isScrolled.value = el.scrollTop > 0.5
}

// ---------- Input handling ----------

// Real terminals stop blinking the cursor while it's actively moving (auto-
// repeat arrow keys, typing) and resume blinking after a short idle window.
// Whenever the caret changes we mark it active and arm a timer to clear
// that state.
let cursorActiveTimer: number | null = null
function nudgeCursorActive() {
  cursorActive.value = true
  if (cursorActiveTimer) window.clearTimeout(cursorActiveTimer)
  cursorActiveTimer = window.setTimeout(() => {
    cursorActive.value = false
  }, 200)
}

// Reads the real caret position from the hidden <input> so we can render
// the visible cursor in the right spot, and marks the cursor as actively
// moving so the blink animation pauses.
function syncCursor() {
  const el = cmdInputRef.value
  if (!el) return
  cursorPos.value = el.selectionStart ?? currentInput.value.length
  nudgeCursorActive()
}

// `selectionchange` on document fires every time the caret moves in the
// focused input — including during arrow-key auto-repeat. Going via keyup
// alone would only sync once the key is released, causing perceived lag.
function onSelectionChange() {
  if (document.activeElement === cmdInputRef.value) syncCursor()
}

// Programmatically jump the caret to the end of currentInput, then sync
// our visible position. Used when we mutate currentInput from outside the
// usual typing flow (history navigation, tab completion).
function setCaretToEnd() {
  nextTick(() => {
    const el = cmdInputRef.value
    if (!el) return
    const end = currentInput.value.length
    el.setSelectionRange(end, end)
    cursorPos.value = end
  })
}

function historyUp() {
  if (history.value.length === 0) return
  if (historyIndex === -1) historyIndex = history.value.length
  historyIndex = Math.max(0, historyIndex - 1)
  currentInput.value = history.value[historyIndex] ?? ''
  setCaretToEnd()
}

function historyDown() {
  if (historyIndex === -1) return
  historyIndex++
  if (historyIndex >= history.value.length) {
    historyIndex = -1
    currentInput.value = ''
  } else {
    currentInput.value = history.value[historyIndex] ?? ''
  }
  setCaretToEnd()
}

// Vue's @keydown.enter / .up / .down / .tab modifiers don't filter
// `event.isComposing` — pressing Enter to commit an IME candidate (CJK,
// Japanese, etc.) would otherwise run the in-progress buffer as a command
// and drop the composition. These wrappers guard explicitly.
function onEnterKey(e: KeyboardEvent) {
  if (e.isComposing) return
  e.preventDefault()
  runCommand()
}
function onUpKey(e: KeyboardEvent) {
  if (e.isComposing) return
  e.preventDefault()
  historyUp()
}
function onDownKey(e: KeyboardEvent) {
  if (e.isComposing) return
  e.preventDefault()
  historyDown()
}

function onTabKey(e: KeyboardEvent) {
  if (e.isComposing) return
  const action = computeCompletion(currentInput.value, e.shiftKey)
  if (action.kind === 'none') return
  e.preventDefault()
  if (action.kind === 'replace') {
    currentInput.value = action.newInput
    setCaretToEnd()
    return
  }
  outputBlocks.value.push({
    id: blockId++,
    cwd: CWD,
    command: action.echo,
    lines: action.lines,
  })
  nextTick(scrollToBottom)
}

function runCommand() {
  const raw = currentInput.value
  const trimmed = raw.trim()
  // Bare Enter on empty input: behave like a real shell — just reset, no
  // echoed phantom prompt block.
  if (!trimmed) {
    currentInput.value = ''
    cursorPos.value = 0
    return
  }
  history.value.push(trimmed)
  historyIndex = -1
  const { lines, clear, openCV } = execute(raw)
  if (openCV) openCVDialog()
  if (clear) {
    outputBlocks.value = []
    cleared.value = true
    // Reset scroll + isScrolled — the browser clamps scrollTop on content
    // shrink but doesn't emit a scroll event, so the top-fade mask would
    // otherwise stick until the user scrolled manually.
    isScrolled.value = false
    const el = getScrollEl()
    if (el) el.scrollTop = 0
  }
  // Push the echo unless the command was a pure clear with no output.
  // Future commands returning both `clear: true` and non-empty lines (e.g.
  // a hypothetical `reset` that prints a status line) still display the
  // message because we run this after the clear branch.
  if (!clear || lines.length) {
    // Echo the trimmed command — history stores trimmed too, so the
    // echoed line stays consistent with what arrow-up restores.
    outputBlocks.value.push({ id: blockId++, cwd: CWD, command: trimmed, lines })
  }
  currentInput.value = ''
  cursorPos.value = 0
  // Drop any pending cursor-active timer so the cursor doesn't sit solid
  // for 200ms after the command line clears.
  if (cursorActiveTimer) {
    window.clearTimeout(cursorActiveTimer)
    cursorActiveTimer = null
  }
  cursorActive.value = false
  nextTick(scrollToBottom)
}

// ---------- Locked height (boot + font swap) ----------

let scrollListenerEl: HTMLElement | null = null
let measuring = false

async function measureLockedHeight() {
  // Guard against re-entrancy: two overlapping calls would interleave
  // their "strip inline height / read / restore" steps and the second
  // could capture the first's empty string as `previousInline`.
  if (measuring) return
  const el = getScrollEl()
  if (!el) return
  measuring = true
  try {
    const previousInline = el.style.height
    el.style.height = ''
    await nextTick()
    lockedHeight.value = el.scrollHeight
    el.style.height = previousInline
  } finally {
    measuring = false
  }
}

watch(isBooting, async (booting) => {
  if (booting) return
  await nextTick()
  focusInput()
  if (lockedHeight.value === null) {
    const el = getScrollEl()
    if (el) lockedHeight.value = el.scrollHeight
  }
})

onMounted(() => {
  document.addEventListener('selectionchange', onSelectionChange)
  document.addEventListener('keydown', onTerminalKeydown)
  // Template refs are populated before onMounted fires, so attach
  // synchronously — wrapping in nextTick opened a race where unmount
  // could run before the listener was attached, leaving the listener
  // attached after teardown.
  const el = getScrollEl()
  if (!el) return
  scrollListenerEl = el
  el.addEventListener('scroll', onTerminalScroll, { passive: true })

  // Recompute the locked height once web fonts swap in. (No resize
  // handler — it would readjust to the current scrollHeight, which
  // includes the user's accumulated output blocks or, after `clear`,
  // collapses to the prompt only. Either way it fights the intent of
  // a stable lock.)
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    document.fonts.ready.then(() => {
      if (lockedHeight.value !== null && !cleared.value) measureLockedHeight()
    }).catch(() => {})
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('selectionchange', onSelectionChange)
  document.removeEventListener('keydown', onTerminalKeydown)
  scrollListenerEl?.removeEventListener('scroll', onTerminalScroll)
  scrollListenerEl = null
  // The 200ms cursor-active timer keeps a closure over the disposed
  // component if left pending across an unmount (HMR, route change).
  if (cursorActiveTimer) {
    window.clearTimeout(cursorActiveTimer)
    cursorActiveTimer = null
  }
})
</script>

<template>
  <v-card
    class="mb-10 terminal-card"
    :class="{ 'is-fullscreen': terminalFullscreen }"
    rounded="lg"
  >
    <div>
      <MacOSHeader
        header-title="Terminal"
        title-class="header-title-dim"
        :fullscreen="terminalFullscreen"
        @close="exitTerminalFullscreen"
        @minimize="exitTerminalFullscreen"
        @maximize="toggleTerminalFullscreen"
      />
      <noscript>
        <div class="noscript-fallback">
        This terminal requires JavaScript. You can still
        <a href="/CV_BOISNARD_Noewen.pdf" target="_blank" rel="noopener">view the CV</a>.
        </div>
      </noscript>
      <v-card-text class="terminal-pad" @click="focusInput">
        <div
          ref="terminalScrollRef"
          class="terminal-content"
          :class="{ 'is-scrolled': isScrolled }"
          :style="lockedHeight !== null && !terminalFullscreen ? { height: `${lockedHeight}px` } : undefined"
        >
          <TerminalBootSession
            v-if="!cleared"
            v-model:booting="isBooting"
            @open-cv="openCVDialog"
          />

          <div class="terminal-lines">
            <div v-for="block in outputBlocks" :key="block.id" class="output-block">
              <div><span class="path">{{ block.cwd }}</span></div>
              <div><span class="prompt">❯</span> <span class="echoed">{{ block.command }}</span></div>
              <div v-for="(line, i) in block.lines" :key="i" class="output-line">
                <template v-for="(seg, j) in line" :key="j">
                  <a v-if="seg.href" :href="seg.href" target="_blank" rel="noopener" :class="seg.class" @click.stop>{{ seg.text }}</a>
                  <span v-else :class="seg.class">{{ seg.text }}</span>
                </template>
              </div>
            </div>

            <div class="active-prompt" :class="{ 'is-reserved': isBooting }">
              <div><span class="path">{{ CWD }}</span></div>
              <div class="prompt-line">
                <span class="prompt">❯</span> <span class="typed">{{ currentInput.slice(0, cursorPos) }}</span><span class="cursor" :class="{ 'is-idle': !inputFocused, 'is-moving': cursorActive }" /><span class="typed">{{ currentInput.slice(cursorPos) }}</span>
                <input
                  ref="cmdInputRef"
                  v-model="currentInput"
                  class="hidden-input"
                  type="text"
                  autocomplete="off"
                  autocorrect="off"
                  autocapitalize="off"
                  spellcheck="false"
                  :disabled="isBooting"
                  :aria-hidden="isBooting ? 'true' : undefined"
                  aria-label="Terminal input"
                  @focus="inputFocused = true; syncCursor()"
                  @blur="inputFocused = false"
                  @input="syncCursor"
                  @keydown.enter="onEnterKey"
                  @keydown.up="onUpKey"
                  @keydown.down="onDownKey"
                  @keydown.tab="onTabKey"
                >
              </div>
            </div>
          </div>
        </div>
      </v-card-text>
    </div>

    <v-dialog
      v-model="dialogCV"
      :fullscreen="dialogCVFullscreen"
      width="800"
      height="90vh"
      transition="dialog-transition"
    >
      <CVObject
        cv-title="CV - BOISNARD Noéwen.pdf"
        cv="/CV_BOISNARD_Noewen.pdf"
        :fullscreen="dialogCVFullscreen"
        @close="dialogCV = false"
        @minimize="dialogCV = false"
        @maximize="dialogCVFullscreen = !dialogCVFullscreen"
      />
    </v-dialog>
  </v-card>
</template>

<style scoped>
.terminal-card {
  width: 600px;
  max-width: 100%;
  background: rgba(30, 15, 35, 0.75) !important;
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset !important;
  position: relative;
  overflow: hidden;
  transition: width 0.2s ease, height 0.2s ease, border-radius 0.2s ease;
}

.terminal-card.is-fullscreen {
  position: fixed;
  inset: 0;
  width: 100vw;
  max-width: none;
  height: 100vh;
  max-height: none;
  margin: 0 !important;
  border-radius: 0 !important;
  z-index: 2000;
}

.terminal-card.is-fullscreen .terminal-content {
  /* Fill the available space below the macOS header (~36px tall). */
  height: calc(100vh - 36px);
}

.terminal-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent 3px,
    rgba(0, 0, 0, 0.04) 3px,
    rgba(0, 0, 0, 0.04) 4px
  );
  pointer-events: none;
  z-index: 2;
  -webkit-mask-image: linear-gradient(to bottom, transparent 0, transparent 28px, black 48px);
  mask-image: linear-gradient(to bottom, transparent 0, transparent 28px, black 48px);
}

.terminal-card ::selection {
  background: #ffffff;
  color: #000000;
  text-shadow: none;
}

.terminal-card :deep(.header-title-dim) {
  color: #565f89 !important;
}

@media (max-width: 600px) {
  .terminal-card {
    width: 100%;
  }
}

.terminal-pad {
  /* Drop the default v-card-text padding so the scroll container starts
     flush under the macOS chrome — that's where the top fade boundary
     belongs. The padding is added back inside .terminal-content. */
  padding: 0 !important;
}

.terminal-content {
  font-family: 'JetBrains Mono', 'JetBrains Mono Fallback', monospace !important;
  font-size: 0.85rem;
  line-height: 1.5 !important;
  color: rgba(255, 255, 255, 0.9) !important;
  padding: 16px;
  position: relative;
  cursor: text;
  overflow-y: auto;
  overscroll-behavior: none;
  scrollbar-gutter: stable;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.18) transparent;
  transition: -webkit-mask-image 0.15s ease, mask-image 0.15s ease;
}

/* Top fade when scrolled — covers the "mid-line" cut that happens with
   touch/scrollbar-drag scrolling. */
.terminal-content.is-scrolled {
  -webkit-mask-image: linear-gradient(to bottom, transparent 0, black 14px);
  mask-image: linear-gradient(to bottom, transparent 0, black 14px);
}

.terminal-content::-webkit-scrollbar {
  width: 8px;
}

.terminal-content::-webkit-scrollbar-track {
  background: transparent;
}

.terminal-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.18);
  border-radius: 4px;
}

.terminal-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.active-prompt.is-reserved {
  visibility: hidden;
}

.prompt-line {
  position: relative;
}

.typed {
  white-space: pre;
  color: rgba(255, 255, 255, 0.95);
}

/* The cursor span itself is a zero-sized inline anchor — no width, no
   height — so inserting it between typed characters doesn't shift any
   text. The visible bar is painted by ::before, positioned absolutely
   over the anchor so it lives entirely outside the document flow. */
.cursor {
  position: relative;
  display: inline-block;
  width: 0;
  height: 0;
}

.cursor::before {
  content: '';
  position: absolute;
  /* 1px bar pinned at the character boundary. In JetBrains Mono the
     inter-glyph gap is exactly 1 pixel (pixel 8 of the cell-pair, between
     cell A's column 7 and cell B's column 9), so a 1px bar at boundary
     fits there for most adjacent pairs. Anti-aliased sub-pixel overlap
     (~0.16px) is visually invisible. */
  left: 0;
  bottom: calc(-0.1em - 1px);
  width: 1px;
  height: 0.95em;
  background: rgba(255, 255, 255, 0.9);
  animation:
    cursor-blink 1.05s steps(2, start) infinite,
    cursor-glow 1.6s ease-in-out infinite;
}

/* Visible focus indicator — blink only while focused, idle stays solid
   + dim (WCAG 2.4.7). */
.cursor.is-idle::before {
  animation: none;
  opacity: 0.35;
}

/* While the caret is actively moving (auto-repeat arrows, typing) the
   cursor stays solid — real terminals pause the blink so the user can
   see exactly where they are. The glow pulse continues for a bit of
   life. */
.cursor.is-moving::before {
  animation: cursor-glow 1.6s ease-in-out infinite;
}

.hidden-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: transparent;
  caret-color: transparent;
  font: inherit;
  padding: 0;
  margin: 0;
}

@keyframes cursor-blink {
  to { visibility: hidden; }
}

@keyframes cursor-glow {
  0%, 100% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.3); }
  50%      { box-shadow: 0 0 8px rgba(255, 255, 255, 0.55); }
}
</style>

<style>
/* Shared terminal text styles — these classes are applied both statically
   in the boot session (kernpm fake CLI) AND dynamically in command output
   segments. The `.terminal-card` prefix keeps them from leaking globally
   while letting them reach into the child <TerminalBootSession>. */
.terminal-card .terminal-lines {
  color: rgba(255, 255, 255, 0.85);
  /* New BFC — prevents margin-collapse-outward from shifting the container
     when the first child's margin-top changes (active-prompt vs output-block). */
  display: flow-root;
}

.terminal-card .path {
  color: #93c5fd;
  font-weight: 500;
  text-shadow: 0 0 6px rgba(147, 197, 253, 0.2);
}

.terminal-card .prompt {
  color: #fca5a5;
  font-weight: 600;
  text-shadow: 0 0 6px rgba(252, 165, 165, 0.2);
}

.terminal-card .command {
  color: #93c5fd;
  font-weight: 500;
  text-shadow: 0 0 6px rgba(147, 197, 253, 0.2);
}

.terminal-card .success {
  color: #86efac;
  text-shadow: 0 0 6px rgba(134, 239, 172, 0.2);
}

.terminal-card .dim,
.terminal-card .dim-file {
  color: rgba(255, 255, 255, 0.4);
}

.terminal-card .value {
  color: #fff;
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.15);
}

.terminal-card .selected {
  color: #93c5fd;
  text-decoration: underline;
  text-shadow: 0 0 6px rgba(147, 197, 253, 0.2);
}

.terminal-card .version {
  color: #c4b5fd;
  text-shadow: 0 0 6px rgba(196, 181, 253, 0.2);
}

.terminal-card .loader {
  color: #fcd34d;
  text-shadow: 0 0 8px rgba(252, 211, 77, 0.3);
}

.terminal-card .echoed {
  color: rgba(255, 255, 255, 0.9);
}

.terminal-card .file {
  color: rgba(255, 255, 255, 0.85);
}

.terminal-card .file-link,
.terminal-card .link {
  color: #93c5fd;
  text-decoration: underline;
  text-shadow: 0 0 6px rgba(147, 197, 253, 0.2);
}

.terminal-card .file-link:hover,
.terminal-card .link:hover {
  color: #bfdbfe;
}

.terminal-card .err {
  color: #fca5a5;
  text-shadow: 0 0 6px rgba(252, 165, 165, 0.2);
}

.terminal-card .md-h1 {
  color: #fff;
  font-weight: 600;
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.18);
}

/* Must match .active-prompt's 6px below — otherwise on every subsequent
   command the echoed line transitions from sitting 6px under its
   predecessor (when it was rendered inside .active-prompt) to sitting
   only 4px under it (as a new .output-block), causing a 2px upward
   visual jump on each Enter. */
.terminal-card .output-block:not(:first-child) {
  margin-top: 6px;
}

.terminal-card .output-line {
  white-space: pre-wrap;
  word-break: break-word;
}

.terminal-card .output-line:empty::before {
  content: '\200B';
}

/* Adjacent-sibling rather than :not(:first-child) — after `clear` the
   boot session is unmounted and active-prompt can become first-child;
   the margin would silently vanish in that state otherwise. */
.terminal-card .result-line + .active-prompt,
.terminal-card .output-block + .active-prompt {
  margin-top: 6px;
}

/* macOS-like fast dialog transition (used by the CV dialog in BootSession) */
.dialog-transition-enter-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.dialog-transition-leave-active {
  transition: all 0.15s cubic-bezier(0.4, 0, 1, 1);
}

.dialog-transition-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.dialog-transition-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
