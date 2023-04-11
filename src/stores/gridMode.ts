import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useRoute } from 'vue-router';

export type GridModes = 'cartesian' | 'polar';
const allGridModes: GridModes[] = ['cartesian', 'polar'];

export const useGridMode = defineStore('gridMode', () => {

  const route = useRoute()

  const gridMode = ref<GridModes>(route.name === 'graph' ? 'polar' : 'cartesian');
  
  const setGridMode = (newGridMode: GridModes) => {
    gridMode.value = newGridMode;
  }
  const cycleGridMode = () => {
    const index = allGridModes.indexOf(gridMode.value);
    const newIndex = (index + 1) % allGridModes.length;
    gridMode.value = allGridModes[newIndex];
  }

  return {gridMode, setGridMode, cycleGridMode}
})
