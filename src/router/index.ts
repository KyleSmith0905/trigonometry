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
        // Native users do not need a home page.
        if (isNative) {
          return {path: '/graph'};
        }
        return true;
      },
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/graph',
      name: 'graph',
      component: () => import('../views/GraphView.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue')
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('../views/PrivacyView.vue')
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('../views/TermsView.vue')
    },
    {
      path: '/returns',
      name: 'returns',
      component: () => import('../views/ReturnsView.vue')
    },
  ]
})

export default router
