<script setup lang="ts">
  import TheFooter from '@/components/TheFooter.vue';
  import TheHeader from '@/components/TheHeader.vue';
  import { ref, watch } from 'vue';

  const childContainerRef = ref<HTMLDivElement | null>(null)
  const offsetColor = ref<'light' | 'dark'>('light')

  watch([childContainerRef], (changes) => {
    const childContainer = changes[0];
    const childCount = childContainer?.childElementCount ?? 0;
    if (childCount % 2 === 1) {
      offsetColor.value = 'dark'
    }
    else {
      offsetColor.value = 'light'
    }
  })
</script>
<template>
  <div ref="scrollContainerRef" class="overflow-y-auto h-screen">
    <div
      :class="{
        'flex flex-col justify-between min-h-screen divide-y divide-slate-300': true,
        'bg-slate-50': offsetColor === 'light',
        'bg-slate-100': offsetColor === 'dark',
      }"
    >
      <TheHeader/>
      <div ref="childContainerRef" class="grow divide-y divide-slate-200">
        <slot></slot>
      </div>
      <TheFooter/>
    </div>
  </div>
</template>