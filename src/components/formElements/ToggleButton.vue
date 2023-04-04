<script setup lang="ts">
  const props = defineProps<{
    text: string,
    value: boolean,
  }>();

  const emits = defineEmits<{
    (e: 'toggle', state: boolean): void
  }>();

  const toggleWrapper = () => {
    emits('toggle', props.value)
  }
</script>
<template>
  <button
    @click="toggleWrapper()"
    :class="{
      'w-full rounded-lg py-1 px-2 cursor-pointer transition-colors': true,
      'bg-slate-100 text-slate-900': props.value === false,
      'bg-slate-700 text-slate-200': props.value === true,
    }"
  >
    <p for="active-sine" class="text-md text-start">{{ props.text }}</p>
  </button>
</template>