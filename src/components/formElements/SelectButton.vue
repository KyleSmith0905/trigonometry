<script setup lang="ts">

  const props = defineProps<{
    value: string,
    options: {icon?: string, label?: string, value: string, locked?: boolean}[]
  }>();

  const emits = defineEmits<{
    (e: 'change', state: string): void
  }>();

  const changeWrapper = (newValue: string) => {
    const optionFull = props.options.find((e) => e.value === newValue);
    if (optionFull?.locked) {
      return;
    }
    emits('change', newValue)
  }
</script>
<template>
  <div class="grid grid-cols-3">
    <button
      v-for="options of props.options"
      @click="changeWrapper(options.value)"
      :key="options.value"
      :class="{
        'relative w-full rounded-lg p-1 cursor-pointer transition-colors': true,
        'bg-slate-300 text-slate-400': options.locked,
        'bg-slate-100 text-slate-800': !options.locked && options.value !== props.value,
        'bg-slate-700 text-slate-200': !options.locked && options.value === props.value,
      }"
    >
      <ion-icon v-if="options.icon" :name="options.icon"></ion-icon>
      <p v-if="!options.icon">{{ options.label }}</p>
      <ion-icon v-if="options.locked" name="lock-closed" class="absolute top-1/4 left-1/4 w-2/4 h-2/4 text-slate-500"></ion-icon>
    </button>
  </div>
</template>