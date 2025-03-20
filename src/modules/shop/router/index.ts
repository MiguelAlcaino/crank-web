import type { RouteRecordRaw } from 'vue-router'

const ROUTE_NAME = 'shop'

export const shopRoute: RouteRecordRaw = {
  path: `/${ROUTE_NAME}`,
  redirect: `/${ROUTE_NAME}/products`,
  component: () => import('@/modules/shop/layouts/ShopLayout.vue'),
  children: [
    {
      path: `/${ROUTE_NAME}/products`,
      name: 'products-list',
      component: () => import('@/modules/shop/views/ProductsView.vue')
    },
    {
      path: `/${ROUTE_NAME}/cart`,
      name: 'shopping-cart',
      component: () => import('@/modules/shop/views/ShoppingCartView.vue')
    },
    {
      path: `/${ROUTE_NAME}/checkout`,
      name: 'checkout',
      component: () => import('@/modules/shop/views/CheckoutView.vue')
    }
  ]
}
