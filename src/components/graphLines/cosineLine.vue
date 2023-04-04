<script setup lang="ts">
  import { useDraggablePoints } from '@/stores/draggablePoints';
  import { mapToGraph } from '@/helpers/graph';
  import { ref } from 'vue';
  import { radiansToDegrees, roundNumbers } from '@/helpers/math';
  import { useFunctionsSettings } from '@/stores/functionsSettings';

  const draggablePointsStore = useDraggablePoints();
  const functionsSettingsStore = useFunctionsSettings();

  const axisPointNew = ref({x: 0, y: 0});
  const textPosition = ref({x: 0, y: 0})
  const cosineEquation = ref('');

  const updateDraggablePoints = (newStore: typeof draggablePointsStore) => {
    const points = newStore.points;
    const angle = newStore.angle;

    // Calculate a good position to show text
    axisPointNew.value = newStore.yRightAnglePoint;
    textPosition.value = {
      x: newStore.yRightAnglePoint.x * 0.5  + points.angle.x * 0.5,
      y: newStore.yRightAnglePoint.y * 0.5  + points.angle.y * 0.5,
    }

    // Writes the equation into 
    const equation = `cosine(${roundNumbers(radiansToDegrees(angle))}°)`;
    const answer = `${roundNumbers(Math.cos(angle), 1)}`;
    if (functionsSettingsStore.cosine.equation === 'answer') cosineEquation.value = answer;
    if (functionsSettingsStore.cosine.equation === 'equation') cosineEquation.value = equation;
    if (functionsSettingsStore.cosine.equation === 'full') cosineEquation.value = [equation, answer].join(' = ');
  }
  setTimeout(() => {
    updateDraggablePoints(draggablePointsStore);
  });
  draggablePointsStore.$onAction((pointsData) => updateDraggablePoints(pointsData.store));
  functionsSettingsStore.$onAction(() => setTimeout(() => updateDraggablePoints(draggablePointsStore)));
</script>

<template>
  <path
    :d="`M${mapToGraph(draggablePointsStore.points.angle)} L${mapToGraph(axisPointNew)}`"
    class="stroke-blue-400 fill-transparent opacity-50 stroke-2"
    stroke-linecap='square'
  ></path>
  <text
    :x="mapToGraph(textPosition, 'x')"
    :y="mapToGraph(textPosition, 'y')"
    :dy="draggablePointsStore.points.angle.y > 0 ? 20 : -20"
    :text-anchor="textPosition.x > 0 ? 'end' : 'start'"
    :dominant-baseline="draggablePointsStore.points.angle.y > 0 ? 'hanging' : 'text-top'"
    stroke-linecap='square'
    class="graph-text fill-blue-400"
  >{{ cosineEquation }}</text>
</template>