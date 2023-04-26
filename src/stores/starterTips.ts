import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Preferences } from '@capacitor/preferences';

export const useStarterTips = defineStore('starterTips', () => {
  const currentTip = ref<number | null>(null);

  Preferences.get({key: 'starterTips'}).then((starterTips) => {
    currentTip.value = parseInt(starterTips.value ?? '0');
  });

  const nextTip = () => {
    currentTip.value = (currentTip.value ?? 0) + 1;
    Preferences.set({key: 'starterTips', value: currentTip.value.toString()});
  };
  

  return {currentTip, nextTip}
})
