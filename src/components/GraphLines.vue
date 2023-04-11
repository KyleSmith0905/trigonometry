<script setup lang="ts">
  import { useGridMode } from '@/stores/gridMode';
  import AxisLines from './graphLines/AxisLines.vue';
  import TriangleLines from './graphLines/TriangleLines.vue';
  import FullCircle from './graphLines/FullCircle.vue';
  import SineLine from './graphLines/SineLine.vue';
  import CosineLine from './graphLines/CosineLine.vue';
  import TangentLine from './graphLines/TangentLine.vue';
  import SecantLine from './graphLines/SecantLine.vue';
  import CosecantLine from './graphLines/CosecantLine.vue';
  import CotangentLine from './graphLines/CotangentLine.vue';
  import { useFunctionsSettings } from '@/stores/functionsSettings';

  const gridModeStore = useGridMode();
  const functionsSettingsStore = useFunctionsSettings();
</script>

<template>
  <div class="absolute flex items-center justify-center w-full h-full overflow-hidden">
    <svg width="100%" height="100%" ref="svgContainer">
      <TriangleLines/>
      <AxisLines/>
      <FullCircle
        v-if="gridModeStore.gridMode === 'polar'"
      />
      <SineLine
        v-if="gridModeStore.gridMode === 'polar' && functionsSettingsStore.sine.active === true"
      />
      <TangentLine
        v-if="gridModeStore.gridMode === 'polar' && functionsSettingsStore.tangent.active === true"
      />
      <SecantLine
        v-if="gridModeStore.gridMode === 'polar' && functionsSettingsStore.secant.active === true"
      />
      <CosineLine
        v-if="gridModeStore.gridMode === 'polar' && functionsSettingsStore.cosine.active === true"
      />
      <CotangentLine
        v-if="gridModeStore.gridMode === 'polar' && functionsSettingsStore.cotangent.active === true"
      />
      <CosecantLine
        v-if="gridModeStore.gridMode === 'polar' && functionsSettingsStore.cosecant.active === true"
      />
    </svg>
  </div>
</template>