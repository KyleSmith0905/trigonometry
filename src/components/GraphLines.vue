<script setup lang="ts">
  import { useGridMode } from '@/stores/gridMode';
  import AxisLines from './graphLines/axisLines.vue';
  import TriangleLines from './graphLines/triangleLines.vue';
  import FullCircle from './graphLines/fullCircle.vue';
  import SineLine from './graphLines/sineLine.vue';
  import CosineLine from './graphLines/cosineLine.vue';
  import TangentLine from './graphLines/tangentLine.vue';
  import SecantLine from './graphLines/secantLine.vue';
  import CosecantLine from './graphLines/cosecantLine.vue';
  import CotangentLine from './graphLines/cotangentLine.vue';
  import { useFunctionsSettings } from '@/stores/functionsSettings';

  const gridModeStore = useGridMode();
  const functionsSettingsStore = useFunctionsSettings();
</script>

<template>
  <div class="absolute flex items-center justify-center w-full h-full overflow-hidden">
    <svg width="100%" height="100%" ref="svgContainer">
      <AxisLines></AxisLines>
      <TriangleLines></TriangleLines>
      <FullCircle
        v-if="gridModeStore.gridMode === 'polar'"
      ></FullCircle>
      <SineLine
        v-if="gridModeStore.gridMode === 'polar' && functionsSettingsStore.sine.active === true"
      ></SineLine>
      <TangentLine
      v-if="gridModeStore.gridMode === 'polar' && functionsSettingsStore.tangent.active === true"
      ></TangentLine>
      <SecantLine
      v-if="gridModeStore.gridMode === 'polar' && functionsSettingsStore.secant.active === true"
      ></SecantLine>
      <CosineLine
        v-if="gridModeStore.gridMode === 'polar' && functionsSettingsStore.cosine.active === true"
      ></CosineLine>
      <CotangentLine
        v-if="gridModeStore.gridMode === 'polar' && functionsSettingsStore.cotangent.active === true"
      ></CotangentLine>
      <CosecantLine
        v-if="gridModeStore.gridMode === 'polar' && functionsSettingsStore.cosecant.active === true"
      ></CosecantLine>
    </svg>
  </div>
</template>