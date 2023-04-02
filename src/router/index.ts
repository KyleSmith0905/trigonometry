import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/graph',
    },
    {
      path: '/graph',
      name: 'graph',
      component: () => import('../views/GraphView.vue')
    }
  ]
})

export default router
