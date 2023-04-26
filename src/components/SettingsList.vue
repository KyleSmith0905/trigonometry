<script setup lang="ts">
  import { useGridMode } from '@/stores/gridMode';
  import { useSettingsMenu } from '@/stores/settingsMenu';
  import { useStarterTips } from '@/stores/starterTips';

  const gridModeStore = useGridMode();
  const settingsMenuStore = useSettingsMenu();
  const starterTipsStore = useStarterTips();
</script>

<template>
  <div class="absolute w-full h-full top-0 pointer-events-none z-30">
    <div class="grid w-max gap-2 m-2">
      <button
        @click="settingsMenuStore.toggleActive()"
        class="relative p-2 bg-slate-200 hover:bg-slate-300 rounded-md ring-2 ring-slate-400 pointer-events-auto text-slate-800"
      >
        <ion-icon class="block text-2xl" name="menu-outline"></ion-icon>
      </button>
      <p v-if="starterTipsStore.currentTip === 1" @click="starterTipsStore.nextTip()" class="absolute w-60 left-16 top-2 px-3 py-2 bg-slate-200 rounded-md ring-2 ring-slate-400 cursor-pointer pointer-events-auto z-10">Click on the hamburger menu for advanced customization.</p>
      <button
        @click="gridModeStore.cycleGridMode()"
        class="p-2 bg-slate-200 hover:bg-slate-300 rounded-md ring-2 ring-slate-400 pointer-events-auto text-slate-800"
      >
        <ion-icon
          :name="(gridModeStore.gridMode === 'cartesian') ? 'contrast' : 'contrast-outline'"
          class="block text-2xl"
        ></ion-icon>
      </button>
      <p v-if="starterTipsStore.currentTip === 0" @click="starterTipsStore.nextTip()" class="absolute w-60 left-16 top-14 px-3 py-2 bg-slate-200 rounded-md ring-2 ring-slate-400 cursor-pointer pointer-events-auto z-10">Click on the swap grid mode button to change between triangle and trigonometry view.</p>
    </div>
  </div>
</template>