import type { RouteRecordRaw } from 'vue-router'
import AfterCheckoutView from '@/modules/shop/views/AfterCheckoutView.vue'

const ROUTE_NAME = 'shop'

export const shopRoute: RouteRecordRaw = {
  path: `/${ROUTE_NAME}`,
  redirect: `/${ROUTE_NAME}/products`,
  component: () => import('@/modules/shop/layouts/ShopLayout.vue'),
  children: [
    {
      path: `/${ROUTE_NAME}/products`,
      name: 'products-list',
      component: () => import('@/modules/shop/views/ProductsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: `/${ROUTE_NAME}/cart`,
      name: 'shopping-cart',
      component: () => import('@/modules/shop/views/ShoppingCartView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: `/${ROUTE_NAME}/checkout`,
      name: 'checkout',
      component: () => import('@/modules/shop/views/CheckoutView.vue')
      // Without requiresAuth to allow access from webview with token
    },
    {
      path: `/${ROUTE_NAME}/after-checkout`,
      name: 'after-checkout',
      component: AfterCheckoutView,
      meta: { requiresAuth: true }
    },
    {
      path: `/payment-link/:id`,
      name: 'payment-link',
      component: () => import('@/modules/shop/views/PaymentLinkView.vue'),
      meta: { requiresAuth: true }
    }
  ]
}
