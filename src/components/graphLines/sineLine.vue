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
  const sineEquation = ref('');

  const updateDraggablePoints = (newStore: typeof draggablePointsStore) => {
    const points = newStore.points;
    const angle = newStore.angle;

    // Calculate a good position to show text
    axisPointNew.value = newStore.xRightAnglePoint;
    textPosition.value = {
      x: newStore.xRightAnglePoint.x * 0.5  + points.angle.x * 0.5,
      y: newStore.xRightAnglePoint.y * 0.5  + points.angle.y * 0.5,
    }

    // Writes the equation into 
    const equation = `sine(${roundNumbers(radiansToDegrees(angle))}°)`;
    const answer = `${roundNumbers(Math.sin(angle), 1)}`;
    if (functionsSettingsStore.sine.equation === 'answer') sineEquation.value = answer;
    if (functionsSettingsStore.sine.equation === 'equation') sineEquation.value = equation;
    if (functionsSettingsStore.sine.equation === 'full') sineEquation.value = [equation, answer].join(' = ');
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
    class="stroke-red-400 fill-transparent opacity-50 stroke-2"
    stroke-linecap='square'
  ></path>
  <text
    :x="mapToGraph(textPosition, 'x')"
    :y="mapToGraph(textPosition, 'y')"
    :dx="textPosition.x > 0 ? 20 : -20"
    :text-anchor="textPosition.x > 0 ? 'start' : 'end'"
    :dominant-baseline="textPosition.y > 0 ? 'text-top' : 'hanging'"
    stroke-linecap='square'
    class="graph-text fill-red-400"
  >{{ sineEquation }}</text>
</template>