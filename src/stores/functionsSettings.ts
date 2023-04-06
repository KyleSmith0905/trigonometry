import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

export interface FunctionData {
  active: boolean;
  name: string;
  equation: 'full' | 'answer' | 'equation';
}

export type FunctionNames = 'sine' | 'secant' | 'tangent' | 'cosine' | 'cosecant' | 'cotangent';

export type FunctionEquations = FunctionData['equation'];

export const useFunctionsSettings = defineStore('functionsSettings', () => {
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
  }

  const changeFunctionEquation = (functionName: FunctionNames, newValue: FunctionEquations) => {
    functionsMap.value[functionName].value.equation = newValue;
  }

  return {sine, secant, tangent, cosine, cosecant, cotangent, toggleFunctionActive, changeFunctionEquation, functionsMap}
})