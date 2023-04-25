<script setup lang="ts">
  import ToggleButton from '@/components/formElements/ToggleButton.vue';
  import { useSettingsMenu } from '@/stores/settingsMenu';
  import { useFunctionsSettings, type FunctionEquations, type FunctionNames } from '@/stores/functionsSettings';
  import SelectButton from './formElements/SelectButton.vue';
  import { computed, ref } from 'vue';
  import ActionButton from '@/components/formElements/ActionButton.vue'
  import { useCurrentUser, useFirebaseAuth } from 'vuefire';

  const settingsMenuStore = useSettingsMenu();
  const functionsSettingsStore = useFunctionsSettings();
  const firebaseAuth = useFirebaseAuth();
  const currentUser = useCurrentUser();

  const activeTrigonometricFunction = ref<FunctionNames>('sine');
  const signingOutLoading = ref(false);
  const activeTrigonometricFunctionSettings = computed(() => {
    return functionsSettingsStore[activeTrigonometricFunction.value]
  });

  const signOut = async () => {
    signingOutLoading.value = true;
    await firebaseAuth?.signOut();
    signingOutLoading.value = false;
  }
</script>

<template>
  <div :class="{
    'h-screen w-0 bg-slate-200 transition-all shadow-2xl shadow-slate-400 z-20 overflow-hidden flex-shrink-0 overflow-y-auto touch-none': true,
    'sm:w-96 w-screen': settingsMenuStore.active
  }">
    <div class="relative sm:w-96 w-screen px-2 grid grid-cols-1 divide-y divide-slate-300 transition-all">
      <button
        @click="settingsMenuStore.toggleActive()"
        class="absolute text-4xl top-2 right-2 rounded-full text-slate-800 hover:bg-slate-300 transition-colors"
      >
        <ion-icon class="block" name="close-circle-outline"></ion-icon>
      </button>
      <div class="p-2">
        <h1 class="my-2 text-lg font-bold text-slate-900">Trigonometric Functions</h1>
        <div class="flex gap-2 flex-col">
          <h2 class="my-1 text-lg font-bold text-center text-slate-600">Select Trigonometric Function</h2>
          <SelectButton
            @change="activeTrigonometricFunction = ($event as FunctionNames)"
            :options="Object.values(functionsSettingsStore.functionsMap).map(e => ({label: e.value.name, value: e.value.id, locked: e.value.locked}))"
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
            :options="[{label: 'Full', value: 'full'}, {label: 'Equation Only', value: 'equation'}, {label: 'Answer Only', value: 'answer'}, {label: 'None', value: 'none'}]"
            :value="activeTrigonometricFunctionSettings.equation"
          />
        </div>
        <h1 class="mt-8 mb-2 text-lg font-bold text-slate-900">Graph Settings</h1>
        <div class="flex gap-2 flex-col">
          <ToggleButton
            @toggle="functionsSettingsStore.toggleIncludeScale()"
            :value="functionsSettingsStore.includeScale"
            text="Include Scale"
          />
        </div>
        <h1 class="mt-8 mb-2 text-lg font-bold text-slate-900">Community And Others</h1>
        <div class="flex gap-2 flex-col">
          <div class="flex">
            <a class="p-2 rounded-md bg-opacity-0 hover:bg-opacity-100 bg-slate-300 transition-colors" href='https://discord.gg/dJKUYq5qEn'>
              <ion-icon class="block text-slate-800 text-4xl" name="logo-discord"></ion-icon>
            </a>
          </div>
          <ActionButton v-if="currentUser?.uid" @click="signOut()" text="Sign Out"/>
          <ActionButton text="Privacy Policy" to="/privacy"/>
          <ActionButton text="Terms of Service" to="/terms"/>
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