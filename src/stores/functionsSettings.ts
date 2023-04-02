import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

interface FunctionData {
  active: boolean;
  name: string;
  equation: 'full' | 'answer' | 'equation';
}

export type FunctionNames = 'sine' | 'secant' | 'tangent' | 'cosine' | 'cosecant' | 'cotangent';

export type FunctionEquations = FunctionData['equation'];

export const useFunctionsSettings = defineStore('functionsSettings', () => {
  const sine = ref<FunctionData>({active: true, equation: 'answer', name: 'Sine'});
  const secant = ref<FunctionData>({active: false, equation: 'answer', name: 'Secant'});
  const tangent = ref<FunctionData>({active: true, equation: 'answer', name: 'Tangent'});
  const cosine = ref<FunctionData>({active: true, equation: 'answer', name: 'Cosine'});
  const cosecant = ref<FunctionData>({active: false, equation: 'answer', name: 'Cosecant'});
  const cotangent = ref<FunctionData>({active: false, equation: 'answer', name: 'Cotangent'});

  const functionsMap = computed(() => {
    return {sine, secant, tangent, cosine, cosecant, cotangent};
  })

  const toggleFunctionActive = (functionName: FunctionNames) => {
    functionsMap.value[functionName].value.active = !functionsMap.value[functionName].value.active;
  }

  const changeFunctionEquation = (functionName: FunctionNames, newValue: FunctionEquations) => {
    console.log(newValue);
    functionsMap.value[functionName].value.equation = newValue;
  }

  return {sine, secant, tangent, cosine, cosecant, cotangent, toggleFunctionActive, changeFunctionEquation, functionsMap}
})