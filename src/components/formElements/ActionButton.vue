<script setup lang="ts">
  import {VueSpinnerGrid} from 'vue3-spinners';
  
  const props = defineProps<{
    text: string,
    loading?: boolean,
  }>();

  const emits = defineEmits<{
    (e: 'click'): void
  }>();

  const buttonClicked = () => {
    if (props.loading) return;
    emits('click')
  }
</script>

<template>
  <button
    @click="buttonClicked()"
    :class="{
      'relative px-2 py-1 rounded-md transition-colors': true,
      'bg-slate-300 text-slate-400': loading,
      'bg-slate-100 hover:bg-slate-300 text-slate-800': !loading,
    }"
  >
    {{ text }}
    <VueSpinnerGrid v-if="loading" class="absolute top-1/4 left-2 h-1/2" color="theme('colors.slate.600')"/>
    <VueSpinnerGrid v-if="loading" class="absolute top-1/4 right-2 h-1/2" color="theme('colors.slate.600')"/>
  </button>
</template>