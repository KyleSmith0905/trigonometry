<script setup lang="ts">

  const props = defineProps<{
    value: string,
    options: {icon?: string, label?: string, value: string}[]
  }>();

  const emits = defineEmits<{
    (e: 'change', state: string): void
  }>();

  const changeWrapper = (newValue: string) => {
    emits('change', newValue)
  }
</script>
<template>
  <div class="flex basis-0">
    <button
      v-for="options of props.options"
      @click="changeWrapper(options.value)"
      :key="options.value"
      :class="{
        'w-full rounded-lg p-1 cursor-pointer transition-colors': true,
        'bg-slate-100 text-slate-800': options.value !== props.value,
        'bg-slate-700 text-slate-200': options.value === props.value,
      }"
    >
      <ion-icon v-if="options.icon" :name="options.icon"></ion-icon>
      <p v-if="!options.icon">{{ options.label }}</p>
    </button>
  </div>
</template>