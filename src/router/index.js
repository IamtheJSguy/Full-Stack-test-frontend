import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/',
    component: () => import('@/views/auth/index'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/auth/register.vue'),
    hidden: true
  },
  {
    path: '/sports',
    component: () => import('@/views/Sports/index.vue'),
    hidden: false
  },
  {
    path: '/app',
    component: () => import('@/layout/simple.vue'),
    redirect: '/app',
    children: [
      {
        path: '',
        component: () => import('@/views/Sports/index'),
        hidden: true
      },
      {
        path: 'sports/:id',
        component: () => import('@/views/Places/index'),
        hidden: true
      }
    ]
  },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
