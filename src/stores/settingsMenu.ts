import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useSettingsMenu = defineStore('settingsMenu', () => {
  const active = ref(false);
  const animationActive = ref(false);
  const animationTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

  const toggleActive = () => {
    active.value = !active.value;
    animationActive.value = true;

    if (animationTimeout.value) clearTimeout(animationTimeout.value);
    animationTimeout.value = setTimeout(() => {
      animationActive.value = false;
      animationTimeout.value = null;
    }, 150);
  }

  return {active, animationActive, toggleActive}
})
