<script setup lang="ts">
  import { useGridMode } from '@/stores/gridMode';
  import { useSettingsMenu } from '@/stores/settingsMenu';

  const gridModeStore = useGridMode();
  const settingsMenuStore = useSettingsMenu();
</script>

<template>
  <div class="absolute w-full h-full top-0 pointer-events-none z-30">
    <div class="grid w-max gap-2 m-2">
      <button
        @click="settingsMenuStore.toggleActive()"
        class="p-2 bg-slate-200 hover:bg-slate-300 rounded-md ring-2 ring-slate-400 pointer-events-auto text-slate-800"
      >
        <ion-icon class="block text-2xl" name="menu-outline"></ion-icon>
      </button>
      <button
        @click="gridModeStore.cycleGridMode()"
        class="p-2 bg-slate-200 hover:bg-slate-300 rounded-md ring-2 ring-slate-400 pointer-events-auto text-slate-800"
      >
        <ion-icon
          :name="(gridModeStore.gridMode === 'cartesian') ? 'contrast' : 'contrast-outline'"
          class="block text-2xl"
        ></ion-icon>
      </button>
    </div>
  </div>
</template>