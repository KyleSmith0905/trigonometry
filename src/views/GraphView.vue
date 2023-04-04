<script setup lang="ts">
  import GridBackground from '@/components/GridBackground.vue';
  import DraggablePoints from '@/components/DraggablePoints.vue';
  import GraphLines from '@/components/GraphLines.vue';
  import SettingsList from '@/components/SettingsList.vue';
  import MenuOverlay from '@/components/MenuOverlay.vue';
  import { useGraphDimensions } from '@/stores/graphDimensions';
  import { ref } from 'vue';
  import { useResizeObserver } from '@vueuse/core';
  
  const graphDimensionsStore = useGraphDimensions();
  const graphContainerRef = ref<HTMLDivElement | null>(null);

  useResizeObserver(graphContainerRef, (entries) => {
    graphDimensionsStore.updateDimensions(
      graphContainerRef.value?.getBoundingClientRect() ?? entries[0].contentRect
    );
  })
</script>

<template>
  <div class="flex">
    <MenuOverlay/>
    <div ref="graphContainerRef" class="w-full h-screen relative">
      <GridBackground/>
      <GraphLines/>
      <DraggablePoints/>
      <SettingsList/>
    </div>
  </div>
</template>

<style>
  @media (min-width: 1024px) {
    .about {
      min-height: 100vh;
      display: flex;
      align-items: center;
    }
  }
</style>
