<script setup lang="ts">
  import TheFooter from '@/components/TheFooter.vue';
  import TheHeader from '@/components/TheHeader.vue';
</script>
<template>
  <div class="overflow-y-auto h-screen" ref="scrollContainerRef">
    <div class="flex flex-col justify-between min-h-screen bg-slate-50 divide-y divide-slate-300 ">
      <TheHeader/>
      <div class="grow divide-y divide-slate-200">
        <slot></slot>
      </div>
      <TheFooter/>
    </div>
  </div>
</template>