<script setup lang="ts">
  import {VueSpinnerGrid} from 'vue3-spinners';
  
  const props = defineProps<{
    text: string,
    to?: string,
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
  <component
    @click="buttonClicked()"
    :is="to ? 'router-link' : 'button'"
    :to="to"
    :class="{
      'relative px-9 py-1 rounded-md transition-colors text-center': true,
      'bg-slate-300 text-slate-400': loading,
      'bg-slate-100 hover:bg-slate-300 text-slate-800': !loading,
    }"
  >
    {{ text }}
    <VueSpinnerGrid v-if="loading" class="absolute top-1/4 left-2 h-1/2" color="theme('colors.slate.600')"/>
    <VueSpinnerGrid v-if="loading" class="absolute top-1/4 right-2 h-1/2" color="theme('colors.slate.600')"/>
  </component>
</template>