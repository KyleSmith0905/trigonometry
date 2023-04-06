import { createRouter, createWebHistory } from 'vue-router'
import { Capacitor } from '@capacitor/core';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      beforeEnter: () => {
        const isNative = Capacitor.isNativePlatform();
        if (isNative) {
          return {path: '/graph'}
        }
        return true;
      },
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/graph',
      name: 'graph',
      component: () => import('../views/GraphView.vue'),
      meta: {
        title: 'About Page - Example App',
        metaTags: [
          {
            name: 'description',
            content: 'The about page of our example app.'
          },
          {
            property: 'og:description',
            content: 'The about page of our example app.'
          }
        ]
      },
    }
  ]
})

export default router
