<script setup lang="ts">
  import ToggleButton from '@/components/ToggleButton.vue';
  import { useSettingsMenu } from '@/stores/settingsMenu';
  import { useFunctionsSettings, type FunctionEquations } from '@/stores/functionsSettings';
  import SelectButton from './SelectButton.vue';

  const settingsMenuStore = useSettingsMenu();
  const functionsSettingsStore = useFunctionsSettings();

</script>

<template>
  <div :class="{
    'h-screen w-0 bg-slate-200 transition-all shadow-2xl z-20 overflow-hidden flex-shrink-0 overflow-y-auto': true,
    'w-96': settingsMenuStore.active
  }">
    <div class="w-96 px-2 grid grid-cols-1 divide-y divide-slate-300">
      <div class="p-2">
        <h1 class="my-2 text-lg font-bold text-slate-900">Trigonometric Functions</h1>
        <div class="flex gap-2 flex-col">
          <div
          v-for="(value, key) of functionsSettingsStore.functionsMap"
          :key="key"
          >
            <h2 class="my-1 text-lg font-bold text-center text-slate-600">{{ value.value.name }}</h2>
            <ToggleButton
              @toggle="functionsSettingsStore.toggleFunctionActive(key)"
              text='Active'
              :value="value.value.active"
            />
            <SelectButton
              @change="functionsSettingsStore.changeFunctionEquation(key, $event as FunctionEquations)"
              :options="[{label: 'Full', value: 'full'}, {label: 'Equation Only', value: 'equation'}, {label: 'Answer Only', value: 'answer'}]"
              :value="value.value.equation"
            />
          </div>
        </div>
      </div>
      <div class="p-2">
        <h1 class="my-2 text-lg font-bold">Draggable Points</h1>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .background-dots {
    background-image: radial-gradient(theme('colors.slate.400') 1px, theme('colors.slate.100') 1px);
    background-size: 25px 25px;
    background-position: center;
  }
</style>