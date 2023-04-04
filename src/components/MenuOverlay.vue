<script setup lang="ts">
  import ToggleButton from '@/components/formElements/ToggleButton.vue';
  import { useSettingsMenu } from '@/stores/settingsMenu';
  import { useFunctionsSettings, type FunctionEquations, type FunctionNames } from '@/stores/functionsSettings';
  import SelectButton from './formElements/SelectButton.vue';
  import { computed, ref } from 'vue';

  const settingsMenuStore = useSettingsMenu();
  const functionsSettingsStore = useFunctionsSettings();
  const activeTrigonometricFunction = ref<FunctionNames>('sine');
  const activeTrigonometricFunctionSettings = computed(() => {
    return functionsSettingsStore[activeTrigonometricFunction.value]
  });

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
          <h2 class="my-1 text-lg font-bold text-center text-slate-600">Select Trigonometric Function </h2>
          <SelectButton
            @change="activeTrigonometricFunction = ($event as FunctionNames)"
            :options="[{label: 'Sine', value: 'sine'}, {label: 'Secant', value: 'secant'}, {label: 'Tangent', value: 'tangent'}, {label: 'Cosine', value: 'cosine'}, {label: 'Cosecant', value: 'cosecant'}, {label: 'Cotangent', value: 'cotangent'}]"
            :value="activeTrigonometricFunction"
          />
          <h2 class="my-1 text-lg font-bold text-center text-slate-600">Edit {{ activeTrigonometricFunctionSettings.name }}</h2>
          <ToggleButton
            @toggle="functionsSettingsStore.toggleFunctionActive(activeTrigonometricFunction)"
            text='Active'
            :value="activeTrigonometricFunctionSettings.active"
          />
          <SelectButton
            @change="functionsSettingsStore.changeFunctionEquation(activeTrigonometricFunction, $event as FunctionEquations)"
            :options="[{label: 'Full', value: 'full'}, {label: 'Equation Only', value: 'equation'}, {label: 'Answer Only', value: 'answer'}]"
            :value="activeTrigonometricFunctionSettings.equation"
          />
        </div>
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