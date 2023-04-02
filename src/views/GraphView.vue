<script setup lang="ts">
  import GridBackground from '@/components/GridBackground.vue';
  import DraggablePoints from '@/components/DraggablePoints.vue';
  import GraphLines from '@/components/GraphLines.vue';
  import SettingsList from '@/components/SettingsList.vue';
  import MenuOverlay from '@/components/MenuOverlay.vue';
</script>

<template>
  <div class="flex">
    <MenuOverlay/>
    <div class="w-full h-screen">
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
