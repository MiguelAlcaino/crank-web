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

import { authService } from '@/services/authService'
import RoomLayoutListView from '@/views/admin/RoomLayoutListView.vue'
import MenuLayout from '@/layouts/MenuLayout.vue'

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
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/admin/class/:id',
      name: 'admin_class',
      component: () => import('../views/admin/AdminClass.vue')
    },
    {
      path: '/admin/calendar-class',
      name: 'admin_calendar_class',
      component: () => import('../views/admin/AdminClassView.vue')   
    },
    {
      path: '/admin/room-layout/list',
      name: 'admin_room_layout_list',
      component: RoomLayoutListView
    },
    {
      path: '/admin/room-layout/create',
      name: 'admin_room_layout_create',
      component: () => import('../views/admin/RoomLayoutView.vue')
    },
    {
      path: '/admin/room-layout/edit/:id',
      name: 'admin_room_layout_edit',
      component: () => import('../views/admin/RoomLayoutView.vue')
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const publicPages = ['/login', '/register', '/forgot-password', '/reset-password', '/calendar']
  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !authService.isLoggedId()) {
    next({ name: 'login', query: { redirect: to.path } })
  } else {
    next()
  }
})

export default router
