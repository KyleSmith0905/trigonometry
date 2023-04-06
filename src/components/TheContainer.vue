<script setup lang="ts">
  import TheFooter from '@/components/TheFooter.vue';
  import TheHeader from '@/components/TheHeader.vue';
</script>
<template>
  <div class="flex flex-col justify-between h-screen bg-slate-50 divide-y divide-slate-200 overflow-y-auto" ref="scrollContainerRef">
    <TheHeader/>
    <div class="h-full divide-y divide-slate-200">
      <slot></slot>
    </div>
    <TheFooter/>
  </div>
</template>