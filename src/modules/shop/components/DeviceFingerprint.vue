<!--
  DeviceFingerprint.vue
  A component responsible for loading the IOVation/Payfort Snare.js script,
  configuring it, and reliably reporting its status (ready or error) to a parent component.
  It uses a MutationObserver to detect when the session ID is generated, avoiding race conditions.
-->

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

// --- Constants ---
const SNARE_SCRIPT_URL = 'https://mpsnare.iesnare.com/snare.js'
const OBSERVER_TIMEOUT = 5000 // 5 seconds to wait for the script to generate the ID.

// --- Props & Emits ---
const props = defineProps<{
  /**
   * The DOM ID for the hidden input field where Snare.js will write the session ID.
   */
  sessionIdInputId: string
}>()

const emit = defineEmits<{
  /**
   * Emitted when the Snare.js script has successfully loaded and generated a session ID.
   * @param e The event name, 'ready'.
   * @param sessionId The generated session ID (blackbox value).
   */
  (e: 'ready', sessionId: string): void
  /**
   * Emitted if the script fails to load or fails to generate a session ID.
   * @param e The event name, 'error'.
   * @param error The error object containing details about the failure.
   */
  (e: 'error', error: Error): void
}>()

// --- Internal State ---
const scriptElement = ref<HTMLScriptElement | null>(null)
let observer: MutationObserver | null = null
let backupInterval: ReturnType<typeof setInterval> | null = null
let timeoutId: ReturnType<typeof setTimeout> | null = null

// --- Lifecycle Hooks ---
onMounted(() => {
  initializeAndMonitorScript()
})

onUnmounted(() => {
  // Cleanup: Remove the script from the DOM if this component created it.
  if (scriptElement.value && scriptElement.value.parentNode) {
    scriptElement.value.parentNode.removeChild(scriptElement.value)
    console.log('Snare.js script removed.')
  }
  // Cleanup: Disconnect the observer to prevent memory leaks.
  if (observer) observer.disconnect()
  if (backupInterval) clearInterval(backupInterval)
  if (timeoutId) clearTimeout(timeoutId)
})

// --- Helper Functions ---

/**
 * Main logic to initialize the script and monitor for the session ID.
 */
async function initializeAndMonitorScript() {
  // Always pre-configure global variables, as the script needs them.
  window.io_bbout_element_id = props.sessionIdInputId
  window.io_install_stm = false
  window.io_exclude_stm = 0
  window.io_install_flash = false
  window.io_enable_rip = true

  // Prevent re-loading the script if it already exists in the DOM.
  if (document.querySelector(`script[src*="iesnare.com"]`)) {
    console.warn('Snare.js script is already loaded. Skipping re-installation.')

    const inputElement = document.getElementById(props.sessionIdInputId) as HTMLInputElement

    if (inputElement && inputElement.value) {
      emit('ready', inputElement.value)
      return
    }

    // If it has no value, we MUST monitor it in case it is generated now.
    try {
      await monitorForSessionId()
    } catch (error) {
      emit('error', error as Error)
    }
    return
  }

  // Configure IOVation globals before loading the script.
  window.io_bbout_element_id = props.sessionIdInputId
  window.io_install_stm = false
  window.io_exclude_stm = 0
  window.io_install_flash = false
  window.io_enable_rip = true

  try {
    scriptElement.value = await loadScript(SNARE_SCRIPT_URL)

    console.log('Snare.js successfully loaded. Monitoring for session ID...')

    // Use MutationObserver instead of setTimeout for reliability.
    await monitorForSessionId()
  } catch (error) {
    console.error('Error during fingerprint initialization:', error)
    emit('error', error as Error)
  }
}

/**
 * Dynamically loads an external script and returns a promise.
 * @param url The URL of the script to load.
 */
function loadScript(url: string): Promise<HTMLScriptElement> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = url
    script.async = true // Prevents the script from blocking the rendering of the page.
    script.onload = () => resolve(script)
    script.onerror = () => reject(new Error(`Failed to load script: ${url}`))
    document.body.appendChild(script)
  })
}

/**
 * Watches the hidden input field for changes and emits 'ready' when a value is set.
 * Rejects if the value is not set within a timeout.
 */
function monitorForSessionId(): Promise<void> {
  return new Promise((resolve, reject) => {
    const targetNode = document.getElementById(props.sessionIdInputId) as HTMLInputElement

    if (!targetNode) {
      return reject(new Error(`Input element "${props.sessionIdInputId}" not found.`))
    }

    const cleanup = () => {
      if (backupInterval) clearInterval(backupInterval)
      if (timeoutId) clearTimeout(timeoutId)
      if (observer) observer.disconnect()
    }

    // Immediate success)
    if (targetNode?.value) {
      emit('ready', targetNode.value)
      return resolve()
    }

    // Safety timeout (If it fails after X seconds)
    timeoutId = setTimeout(() => {
      cleanup()
      reject(new Error('Timeout: Fingerprint session ID not generated.'))
    }, OBSERVER_TIMEOUT)

    // Backup polling (every 500 ms)
    backupInterval = setInterval(() => {
      if (targetNode?.value) {
        console.log('Session ID detected via Polling.')
        emit('ready', targetNode.value)
        cleanup()
        resolve()
      }
    }, 500)

    // Mutation Observer
    observer = new MutationObserver(() => {
      if (targetNode.value) {
        console.log('Session ID detected via MutationObserver.')
        emit('ready', targetNode.value)
        cleanup()
        resolve()
      }
    })

    observer.observe(targetNode, { attributes: true })
  })
}
</script>

<template>
  <!-- This hidden input is required by the third-party Snare.js script to store the session ID (blackbox). -->
  <input type="hidden" :id="sessionIdInputId" name="io_blackbox" />
</template>
