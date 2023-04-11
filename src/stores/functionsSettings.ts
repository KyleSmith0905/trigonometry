import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { Preferences } from '@capacitor/preferences';

export interface FunctionData {
  name: string;
  id: string;
  active: boolean;
  equation: 'full' | 'answer' | 'equation';
}

export type FunctionNames = 'sine' | 'secant' | 'tangent' | 'cosine' | 'cosecant' | 'cotangent';

export type FunctionEquations = FunctionData['equation'];

export const useFunctionsSettings = defineStore('functionsSettings', () => {
  // Hydrate settings based off of storage
  Preferences.get({key: 'functionsSettings'}).then((settingsString) => {
    if (!settingsString.value) return;
    const settings: Record<FunctionNames, Partial<FunctionData>> = JSON.parse(settingsString.value);

    if (settings.sine) sine.value = {...sine.value, ...settings.sine};
    if (settings.secant) secant.value = {...secant.value, ...settings.secant};
    if (settings.tangent) tangent.value = {...tangent.value, ...settings.tangent};
    if (settings.cosine) cosine.value = {...cosine.value, ...settings.cosine};
    if (settings.cosecant) cosecant.value = {...cosecant.value, ...settings.cosecant};
    if (settings.cotangent) cotangent.value = {...cotangent.value, ...settings.cotangent};
  });
  Preferences.get({key: 'includeScale'}).then((settingsString) => {
    if (!includeScale.value) return;
    includeScale.value = settingsString.value === 'true';
  });

  const sine = ref<FunctionData>({active: true, equation: 'full', name: 'Sine', id: 'sine'});
  const secant = ref<FunctionData>({active: false, equation: 'full', name: 'Secant', id: 'secant'});
  const tangent = ref<FunctionData>({active: true, equation: 'full', name: 'Tangent', id: 'tangent'});
  const cosine = ref<FunctionData>({active: true, equation: 'full', name: 'Cosine', id: 'cosine'});
  const cosecant = ref<FunctionData>({active: false, equation: 'full', name: 'Cosecant', id: 'cosecant'});
  const cotangent = ref<FunctionData>({active: false, equation: 'full', name: 'Cotangent', id: 'cotangent'});

  const includeScale = ref(true);

  const functionsMap = computed(() => {
    return {sine, secant, tangent, cosine, cosecant, cotangent};
  })

  const toggleFunctionActive = (functionName: FunctionNames) => {
    functionsMap.value[functionName].value.active = !functionsMap.value[functionName].value.active;
    saveCurrentSettings();
  }

  const changeFunctionEquation = (functionName: FunctionNames, newValue: FunctionEquations) => {
    functionsMap.value[functionName].value.equation = newValue;
    saveCurrentSettings();
  }

  const saveCurrentSettings = () => {
    const savedSettings = {
      sine: {active: sine.value.active, equation: sine.value.equation},
      secant: {active: secant.value.active, equation: secant.value.equation},
      tangent: {active: tangent.value.active, equation: tangent.value.equation},
      cosine: {active: cosine.value.active, equation: cosine.value.equation},
      cosecant: {active: cosecant.value.active, equation: cosecant.value.equation},
      cotangent: {active: cotangent.value.active, equation: cotangent.value.equation},
    };
    Preferences.set({key: 'functionsSettings', value: JSON.stringify(savedSettings)})
  }
  
  const toggleIncludeScale = () => {
    includeScale.value = !includeScale.value;
    Preferences.set({key: 'includeScale', value: includeScale.value ? 'true' : 'false'});
  }

  return {
    sine,
    secant,
    tangent,
    cosine,
    cosecant,
    cotangent,
    includeScale, toggleIncludeScale,
    functionsMap,
    toggleFunctionActive,
    changeFunctionEquation,
    saveCurrentSettings,
  }
})