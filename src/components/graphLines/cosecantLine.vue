<script setup lang="ts">
  import { useDraggablePoints } from '@/stores/draggablePoints';
  import { useFunctionsSettings } from '@/stores/functionsSettings';
  import { mapToGraph, pointsDistance, pointsToSlope, rayTraceToWall } from '@/helpers/graph';
  import { ref } from 'vue';
  import { radiansToDegrees, roundNumbers } from '@/helpers/math';
  import { useGraphDimensions } from '@/stores/graphDimensions';
  import GraphText from '../GraphText.vue';

  const draggablePointsStore = useDraggablePoints();
  const functionsSettingsStore = useFunctionsSettings();
  const graphDimensionsStore = useGraphDimensions();

  const cotangentPointAngle = ref({x: 0, y: 0});
  const textPosition = ref({x: 0, y: 0})
  const cosecantEquation = ref('');

  const updateDraggablePoints = (newStore: typeof draggablePointsStore) => {
    const points = newStore.points;
    const cotangentPoint = newStore.cotangentPoint;
    const angle = newStore.angle;

    // Bounds the line connecting the tangent and the angle point.
    const angleSlopeData = pointsToSlope(cotangentPoint, points.main);
    cotangentPointAngle.value = rayTraceToWall(angleSlopeData, points.main, graphDimensionsStore.walls);
    if (pointsDistance(cotangentPoint, points.main) < pointsDistance(cotangentPointAngle.value, points.main)) {
      cotangentPointAngle.value = cotangentPoint;
    }

    // Calculate a good position to show text
    textPosition.value = {
      x: cotangentPointAngle.value.x * 0.5  + draggablePointsStore.points.main.x * 0.5,
      y: cotangentPointAngle.value.y * 0.5  + draggablePointsStore.points.main.y * 0.5,
    }

    // Writes the equation into 
    const equation = `cosecant(${roundNumbers(radiansToDegrees(angle))}°)`;
    const answer = `${roundNumbers(1 / Math.sin(angle), 1)}`;
    if (functionsSettingsStore.cosecant.equation === 'answer') cosecantEquation.value = answer;
    if (functionsSettingsStore.cosecant.equation === 'equation') cosecantEquation.value = equation;
    if (functionsSettingsStore.cosecant.equation === 'full') cosecantEquation.value = [equation, answer].join(' = ');
  }
  setTimeout(() => {
    updateDraggablePoints(draggablePointsStore);
  });
  draggablePointsStore.$onAction((pointsData) => updateDraggablePoints(pointsData.store));
  functionsSettingsStore.$onAction(() => setTimeout(() => updateDraggablePoints(draggablePointsStore)));
  graphDimensionsStore.$subscribe(() => updateDraggablePoints(draggablePointsStore));
</script>

<template>
  <path
    :d="`M${mapToGraph(cotangentPointAngle)} L${mapToGraph(draggablePointsStore.points.main)}`"
    class="stroke-blue-400 fill-transparent opacity-50 stroke-2"
    stroke-linecap='square'
  ></path>
  <GraphText
    :position="textPosition"
    :alignX="textPosition.x <= 0 ? 'left' : 'right'"
    :alignY="textPosition.y <= 0 ? 'top' : 'bottom'"
    :text="cosecantEquation"
    color="#60a5fa"
  />
</template>