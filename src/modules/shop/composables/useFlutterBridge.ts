import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  isFlutterWebView,
  notifyPaymentFailure,
  notifyPaymentPending,
  notifyPaymentSuccess
} from '@/modules/shop/utils/flutter-communication'

export const useFlutterBridge = () => {
  const route = useRoute()

  const webviewToken = computed(() => route.query.token as string | undefined)
  const hasToken = computed(() => !!webviewToken.value)

  const isInWebview = computed(() => isFlutterWebView(hasToken.value))

  const sendSuccess = () => {
    if (isInWebview.value) notifyPaymentSuccess(hasToken.value)
  }

  const sendFailure = () => {
    if (isInWebview.value) notifyPaymentFailure(hasToken.value)
  }

  const sendPending = () => {
    if (isInWebview.value) notifyPaymentPending(hasToken.value)
  }

  return {
    isInWebview,
    webviewToken,
    sendSuccess,
    sendFailure,
    sendPending
  }
}
