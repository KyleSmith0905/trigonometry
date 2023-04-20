<script setup lang="ts">
  import { useDraggablePoints } from '@/stores/draggablePoints';
  import { useGraphDimensions } from '@/stores/graphDimensions';
  import { StripeElementCard } from '@vue-stripe/vue-stripe';
  import { useEventListener, useResizeObserver } from '@vueuse/core';
  import { ref } from 'vue';
  
  const graphDimensionsStore = useGraphDimensions();
  const draggablePointsStore = useDraggablePoints();
  const graphContainerRef = ref<HTMLDivElement | null>(null);
  const scrollContainerRef = ref<HTMLDivElement | null>(null);

  useResizeObserver(graphContainerRef, (entries) => {
    graphDimensionsStore.updateDimensions(
      graphContainerRef.value?.getBoundingClientRect() ?? entries[0].contentRect
    );
  });
  
  useEventListener(scrollContainerRef, 'scroll', () => {
    const dimensions = graphContainerRef.value?.getBoundingClientRect();
    if (dimensions) {
      graphDimensionsStore.updateDimensions(dimensions);
    };
  });
  
  draggablePointsStore.setPoint('main', {x: 0, y: -2});
  draggablePointsStore.setPoint('axis', {x: 5, y: -2});
  draggablePointsStore.setPoint('angle', {x: 5, y: 2});
</script>

<template>
  <TheContainer>
    <div class="fixed h-full" ref="graphContainerRef">
      <GridBackground/>
    </div>
    <div class="h-full">
      <div class="max-w-2xl">
        <p>Hello World</p>
        <StripeElementCard></StripeElementCard>
      </div>
    </div>
  </TheContainer>
</template>