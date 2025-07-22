import { ref, readonly } from 'vue'

// --- SINGLETON STATE FOR THE GLOBAL MODAL ---
// These refs are defined outside the composable function, making them singletons.
// This ensures that any part of the application calling `useModal` will interact with the same modal instance.

/**
 * @description Controls the visibility of the global modal.
 */
const isVisible = ref(false)

/**
 * @description The title displayed in the modal's header.
 */
const title = ref('')

/**
 * @description The main content/message displayed in the modal's body.
 */
const message = ref('')

// --- PROMISE HANDLERS ---
// These module-level variables will store the `resolve` and `reject` functions of the active promise.
// This allows the event handlers (`handleConfirm`, `handleCancel`) to resolve or reject the promise
// that was created by `showConfirmation`.

let resolvePromise: (value: boolean) => void
let rejectPromise: (reason?: any) => void

/**
 * @description A composable to manage a global, promise-based confirmation modal.
 * This provides a clean, async/await interface for user confirmation flows.
 */
export const useModal = () => {
  /**
   * Displays the confirmation modal and returns a promise that resolves or rejects based on user interaction.
   * This allows business logic to `await` a user's decision.
   *
   * @example
   * try {
   *   await showConfirmation('Delete Item', 'Are you sure?');
   *   // ... user clicked OK, proceed with deletion
   * } catch {
   *   // ... user clicked Cancel
   * }
   *
   * @param {string} newTitle - The title for the modal.
   * @param {string} newMessage - The message content for the modal.
   * @returns {Promise<boolean>} A promise that resolves to `true` if the user confirms, and rejects if the user cancels.
   */
  const showConfirmation = (newTitle: string, newMessage: string): Promise<boolean> => {
    title.value = newTitle
    message.value = newMessage
    isVisible.value = true

    return new Promise<boolean>((resolve, reject) => {
      // Store the promise's resolve and reject functions so they can be called from outside this scope.
      resolvePromise = resolve
      rejectPromise = reject
    })
  }

  /**
   * Handles the 'confirm' or 'OK' action from the modal component.
   * It resolves the active promise with `true` and hides the modal.
   */
  const handleConfirm = () => {
    if (resolvePromise) {
      resolvePromise(true)
    }
    isVisible.value = false
  }

  /**
   * Handles the 'cancel' or 'Close' action from the modal component.
   * It rejects the active promise and hides the modal.
   */
  const handleCancel = () => {
    if (rejectPromise) {
      // We reject with an error to allow `try/catch` blocks to work as expected.
      rejectPromise(new Error('User cancelled the action.'))
    }
    isVisible.value = false
  }

  return {
    // --- State (Readonly) ---
    // Expose the state as readonly to prevent components from directly mutating it.
    // State changes should only be driven by the methods below.
    isVisible: readonly(isVisible),
    title: readonly(title),
    message: readonly(message),

    // --- Methods ---
    // These are the public API of the composable.
    showConfirmation,
    handleConfirm,
    handleCancel
  }
}
