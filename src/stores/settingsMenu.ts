import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useSettingsMenu = defineStore('settingsMenu', () => {
  const active = ref(false);

  const toggleActive = () => {
    active.value = !active.value;
  }

  return {active, toggleActive}
})
