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
    }
  ]
}
