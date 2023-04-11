<script setup lang="ts">
  import { useDraggablePoints, type Points } from '@/stores/draggablePoints';
  import { mapToGraph } from '@/helpers/graph';
  import { ref } from 'vue';
  import { useFunctionsSettings } from '@/stores/functionsSettings';
  import GraphText from '../GraphText.vue';
  import { writeEquation } from '@/helpers/string';

  const draggablePointsStore = useDraggablePoints();
  const functionsSettingsStore = useFunctionsSettings();

  const axisPointNew = ref({x: 0, y: 0});
  const textPosition = ref({x: 0, y: 0})
  const cosineEquation = ref('');

  const updateDraggablePoints = (points: Points) => {
    const yRightAnglePoint = draggablePointsStore.calculateYRightAnglePoint(points);

    // Calculate a good position to show text
    axisPointNew.value = yRightAnglePoint;
    textPosition.value = {
      x: yRightAnglePoint.x * 0.5  + points.angle.x * 0.5,
      y: yRightAnglePoint.y * 0.5  + points.angle.y * 0.5,
    }

    cosineEquation.value = writeEquation(functionsSettingsStore.cosine, (angle) => Math.cos(angle))
  }
  setTimeout(() => {
    updateDraggablePoints(draggablePointsStore.points);
  });
  draggablePointsStore.$subscribe((_, pointsData) => updateDraggablePoints(pointsData.points));
  functionsSettingsStore.$subscribe(() => updateDraggablePoints(draggablePointsStore.points));
</script>

<template>
  <path
    :d="`M${mapToGraph(draggablePointsStore.points.angle)} L${mapToGraph(axisPointNew)}`"
    class="stroke-green-400 fill-transparent opacity-50 stroke-2"
    stroke-linecap='square'
  ></path>
  <GraphText
    :position="textPosition"
    :alignX="textPosition.x <= 0 ? 'left' : 'right'"
    :alignY="textPosition.y <= 0 ? 'top' : 'bottom'"
    :text="cosineEquation"
    color="#4ade80"
  />
</template>