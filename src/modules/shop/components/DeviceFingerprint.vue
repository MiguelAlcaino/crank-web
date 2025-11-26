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
let observer: MutationObserver | null = null // To hold the MutationObserver instance.

// --- Lifecycle Hooks ---
onMounted(() => {
  // The hook now only orchestrates, calling a dedicated function.
  initializeAndMonitorScript()
})

onUnmounted(() => {
  // Cleanup: Remove the script from the DOM if this component created it.
  if (scriptElement.value && scriptElement.value.parentNode) {
    scriptElement.value.parentNode.removeChild(scriptElement.value)
    console.log('Snare.js script removed.')
  }
  // Cleanup: Disconnect the observer to prevent memory leaks.
  if (observer) {
    observer.disconnect()
  }
})

// --- Helper Functions ---

/**
 * Main logic to initialize the script and monitor for the session ID.
 */
async function initializeAndMonitorScript() {
  // Prevent re-loading the script if it already exists in the DOM.
  if (document.querySelector(`script[src*="iesnare.com"]`)) {
    console.warn('Snare.js script is already loaded. Skipping re-installation.')
    const inputElement = document.getElementById(props.sessionIdInputId) as HTMLInputElement
    if (inputElement && inputElement.value) emit('ready', inputElement.value)
    return
  }

  // Configure IOVation globals before loading the script.
  window.io_bbout_element_id = props.sessionIdInputId
  window.io_install_stm = false
  window.io_exclude_stm = 0
  window.io_install_flash = false
  window.io_enable_rip = true

  try {
    const loadedScript = await loadScript(SNARE_SCRIPT_URL)
    scriptElement.value = loadedScript

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
    const targetNode = document.getElementById(props.sessionIdInputId)

    if (!targetNode) {
      return reject(new Error(`Input element with ID "${props.sessionIdInputId}" not found.`))
    }

    // Set a timeout to prevent the observer from running indefinitely.
    const timeoutId = setTimeout(() => {
      observer?.disconnect()
      reject(
        new Error(
          `Timeout: Session ID was not generated within ${OBSERVER_TIMEOUT / 1000} seconds.`
        )
      )
    }, OBSERVER_TIMEOUT)

    // Create an observer to watch for attribute changes on the input field.
    observer = new MutationObserver((mutationsList, obs) => {
      for (const mutation of mutationsList) {
        // We are specifically interested in when the 'value' attribute is changed by the external script.
        // NOTE: For hidden inputs, changing `.value` programmatically might not trigger an 'attributes' mutation.
        // A more robust approach is to check the value inside the callback, but 'attributes' is a good starting point.
        if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
          const input = mutation.target as HTMLInputElement
          if (input.value) {
            console.log('Session ID detected via MutationObserver.')
            emit('ready', input.value)

            // Cleanup after success
            clearTimeout(timeoutId)
            obs.disconnect()
            resolve()
            return
          }
        }
      }
    })

    // Start observing the target node for attribute changes.
    observer.observe(targetNode, { attributes: true })
  })
}
</script>

<template>
  <!-- This hidden input is required by the third-party Snare.js script to store the session ID (blackbox). -->
  <input type="hidden" :id="sessionIdInputId" name="io_blackbox" />
</template>
