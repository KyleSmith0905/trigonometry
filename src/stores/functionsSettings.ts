import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { Preferences } from '@capacitor/preferences';

export interface FunctionData {
  active: boolean;
  name: string;
  equation: 'full' | 'answer' | 'equation';
}

export type FunctionNames = 'sine' | 'secant' | 'tangent' | 'cosine' | 'cosecant' | 'cotangent';

export type FunctionEquations = FunctionData['equation'];

export const useFunctionsSettings = defineStore('functionsSettings', () => {
  // Hydrate settings based off of storage
  Preferences.get({key: 'functionsSettings'}).then((settingsString) => {
    console.log(settingsString);
    if (!settingsString.value) return;
    const settings: Record<FunctionNames, Partial<FunctionData>> = JSON.parse(settingsString.value);

    if (settings.sine) sine.value = {...sine.value, ...settings.sine};
    if (settings.secant) secant.value = {...secant.value, ...settings.secant};
    if (settings.tangent) tangent.value = {...tangent.value, ...settings.tangent};
    if (settings.cosine) cosine.value = {...cosine.value, ...settings.cosine};
    if (settings.cosecant) cosecant.value = {...cosecant.value, ...settings.cosecant};
    if (settings.cotangent) cotangent.value = {...cotangent.value, ...settings.cotangent};
  });

  const sine = ref<FunctionData>({active: true, equation: 'full', name: 'Sine'});
  const secant = ref<FunctionData>({active: false, equation: 'full', name: 'Secant'});
  const tangent = ref<FunctionData>({active: true, equation: 'full', name: 'Tangent'});
  const cosine = ref<FunctionData>({active: true, equation: 'full', name: 'Cosine'});
  const cosecant = ref<FunctionData>({active: false, equation: 'full', name: 'Cosecant'});
  const cotangent = ref<FunctionData>({active: false, equation: 'full', name: 'Cotangent'});

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

  return {sine, secant, tangent, cosine, cosecant, cotangent, toggleFunctionActive, changeFunctionEquation, saveCurrentSettings, functionsMap}
})