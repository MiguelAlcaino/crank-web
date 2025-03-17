import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import BookingCalendarView from '../views/BookingCalendarView.vue'
import ProfileView from '../views/ProfileView.vue'
import ClassView from '../views/ClassView.vue'
import BookingsView from '../views/BookingsView.vue'
import PurchasesView from '../views/PurchasesView.vue'
import ChangePasswordView from '../views/ChangePasswordView.vue'
import ForgotPasswordView from '../views/ForgotPasswordView.vue'
import ChangeSpotView from '../views/ChangeSpotView.vue'
import ResetPasswordView from '../views/ResetPasswordView.vue'
import WorkoutStatsView from '../views/WorkoutStatsView.vue'
import WorkoutSummaryView from '../views/WorkoutSummaryView.vue'
import { authService } from '@/services/authService'
import MenuLayout from '@/layouts/MenuLayout.vue'
import PaymentsIframeView from '@/views/PaymentsIframeView.vue'
import LoginRedirectView from '@/modules/login-redirect/views/LoginRedirectView.vue'
import SmsVerificationView from '@/modules/buy_packages/views/SmsVerificationView.vue'
import { shopRoute } from '@/modules/shop/router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'user',
      component: MenuLayout,
      children: [
        {
          path: '/profile',
          name: 'profile',
          component: ProfileView
        },
        {
          path: '/bookings',
          name: 'bookings',
          component: BookingsView
        },
        {
          path: '/purchases',
          name: 'purchases',
          component: PurchasesView
        },
        {
          path: '/workout-stats',
          name: 'workout_stats',
          component: WorkoutStatsView
        },
        {
          path: '/workout-summary/:id',
          name: 'workout_summary',
          component: WorkoutSummaryView
        },
        {
          path: '/change-password',
          name: 'change_password',
          component: ChangePasswordView
        }
      ]
    },
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/logout',
      name: 'logout',
      redirect: '/login',
      beforeEnter: (to, from, next) => {
        authService.logout()
        next()
      }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: BookingCalendarView
    },
    {
      path: '/class/:id',
      name: 'class',
      component: ClassView
    },
    {
      path: '/forgot-password',
      name: 'forgot_password',
      component: ForgotPasswordView
    },
    {
      path: '/reset-password',
      name: 'reset_password',
      component: ResetPasswordView
    },
    {
      path: '/change-spot/:classId',
      name: 'change_spot',
      component: ChangeSpotView
    },
    {
      path: '/payments',
      name: 'payments',
      component: PaymentsIframeView
    },
    {
      path: '/login-redirect',
      name: 'login_redirect',
      component: LoginRedirectView
    },
    {
      path: '/sms-verification',
      name: 'sms_verification',
      component: SmsVerificationView
    },
    {
      ...shopRoute,
      path: '/shop',
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const publicPages = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/calendar',
    '/login-redirect'
  ]
  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !authService.isLoggedId()) {
    next({ name: 'login', query: { redirect: to.path } })
  } else {
    next()
  }
})

export default router
