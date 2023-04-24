<script setup lang="ts">
  defineProps<{
    value?: string,
    label: string,
    type?: 'password' | 'email',
  }>();

  const emits = defineEmits<{
    (e: 'change', state: string): void
  }>();


  const changeWrapper = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emits('change', target.value);
  }
</script>
<template>
  <div class="flex flex-col w-60">
    <label class="paragraph">{{ label }}</label>
    <input
      @input="changeWrapper($event)"
      :type="type"
      class="w-full rounded-lg p-1 transition-colors bg-slate-100 text-slate-800"
    />
  </div>
</template>