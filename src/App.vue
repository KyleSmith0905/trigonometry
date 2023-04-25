<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import BaseModal from './components/modals/BaseModal.vue';
  import { useModalGenerator } from './stores/modalGenerator';

  const modalGeneratorStore = useModalGenerator();
</script>

<template>
  <BaseModal v-for="modal of modalGeneratorStore.modals" :key="modal.id" :content="modal.content" :leaving="modal.leaving"/>
  <RouterView />
</template>

<style scoped>
</style>