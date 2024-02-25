import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/middlewares'
import { beforeEach } from '@/router/beforeEach'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/AuthView/AuthView.vue'),
    },
  ],
})

router.beforeEach(beforeEach)

// TODO: add 404 etc
// router.onError()

export default router
