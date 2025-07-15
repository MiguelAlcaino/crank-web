import { computed, readonly, ref } from 'vue'
import type { IApiService } from '@/services/IApiService'

import type { BasicUser } from '@/modules/auth/types'

// --- State ---
const user = ref<BasicUser | null>(null)
const isLoading = ref(false)
const error = ref<Error | null>(null)

// --- Composable Function ---
export function useAuth(apiService?: IApiService) {
  /**
   * @description Fetches the current user's data from the API and updates the state.
   * This should typically be called once when the application loads.
   */
  const fetchCurrentUser = async () => {
    if (!apiService) return

    if (isLoading.value || user.value) return

    isLoading.value = true
    error.value = null
    try {
      const basicUserData = await apiService.getMyselfBasic()
      user.value = basicUserData
    } catch (e) {
      error.value = e as Error
      user.value = null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * @description Clears user data, effectively logging them out.
   */
  const logout = () => {
    user.value = null
  }

  return {
    // --- State ---
    user: readonly(user),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // --- Computed ---
    isAuthenticated: computed(() => !!user.value),

    // --- Methods ---
    fetchCurrentUser,
    logout
  }
}
