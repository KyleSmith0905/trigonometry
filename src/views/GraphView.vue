<script setup lang="ts">
  import GridBackground from '@/components/GridBackground.vue';
  import DraggablePoints from '@/components/DraggablePoints.vue';
  import GraphLines from '@/components/GraphLines.vue';
  import SettingsList from '@/components/SettingsList.vue';
  import MenuOverlay from '@/components/MenuOverlay.vue';
  import { useGraphDimensions } from '@/stores/graphDimensions';
  import { onMounted, ref } from 'vue';
  import { useResizeObserver } from '@vueuse/core';
  import { useHead } from '@vueuse/head';
  import { useRoute } from 'vue-router'
  import { useModalGenerator } from '@/stores/modalGenerator';

  const graphContainerRef = ref<HTMLDivElement | null>(null);
  const shownPaymentSuccessModal = ref(false);

  const route = useRoute();
  const graphDimensionsStore = useGraphDimensions();
  const modalGeneratorStore = useModalGenerator();

  useResizeObserver(graphContainerRef, (entries) => {
    graphDimensionsStore.updateDimensions(
      graphContainerRef.value?.getBoundingClientRect() ?? entries[0].contentRect
    );
  });

  useHead({
    meta: [
      {name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'},
    ]
  });

  onMounted(() => {
    const query = route.query;
    if (shownPaymentSuccessModal.value || !query.payment_intent || query.redirect_status !== 'succeeded') return;
    modalGeneratorStore.openModal('payment-success')
    shownPaymentSuccessModal.value = true;
  })
</script>

<template>
  <div class="flex" >
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
