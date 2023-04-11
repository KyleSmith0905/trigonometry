<script setup lang="ts">
  import { useDraggablePoints } from '@/stores/draggablePoints';
  import { mapToGraph, pointsDistance, pointsToSlope, rayTraceToWall } from '@/helpers/graph';
  import { ref } from 'vue';
  import { radiansToDegrees, roundNumbers } from '@/helpers/math';
  import { useFunctionsSettings } from '@/stores/functionsSettings';
  import { useGraphDimensions } from '@/stores/graphDimensions';
  import GraphText from '../GraphText.vue';

  const draggablePointsStore = useDraggablePoints();
  const functionsSettingsStore = useFunctionsSettings();
  const graphDimensionsStore = useGraphDimensions();

  const tangentPointAngle = ref({x: 0, y: 0});
  const textPosition = ref({x: 0, y: 0})
  const secantEquation = ref('');

  const updateDraggablePoints = (newStore: typeof draggablePointsStore) => {
    const points = newStore.points;
    const tangentPoint = newStore.tangentPoint;
    const angle = newStore.angle;

    // Bounds the line connecting the tangent and the angle point.
    const angleSlopeData = pointsToSlope(tangentPoint, points.main);
    tangentPointAngle.value = rayTraceToWall(angleSlopeData, points.main, graphDimensionsStore.walls);
    if (pointsDistance(tangentPoint, points.main) < pointsDistance(tangentPointAngle.value, points.main)) {
      tangentPointAngle.value = tangentPoint;
    }

    // Calculate a good position to show text
    textPosition.value = {
      x: tangentPointAngle.value.x * 0.5  + draggablePointsStore.points.main.x * 0.5,
      y: tangentPointAngle.value.y * 0.5  + draggablePointsStore.points.main.y * 0.5,
    }

    // Writes the equation into 
    const equation = `secant(${roundNumbers(radiansToDegrees(angle))}°)`;
    const answer = `${roundNumbers(1 / Math.cos(angle), 1)}`;
    if (functionsSettingsStore.secant.equation === 'answer') secantEquation.value = answer;
    if (functionsSettingsStore.secant.equation === 'equation') secantEquation.value = equation;
    if (functionsSettingsStore.secant.equation === 'full') secantEquation.value = [equation, answer].join(' = ');
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
    :d="`M${mapToGraph(tangentPointAngle)} L${mapToGraph(draggablePointsStore.points.main)}`"
    class="stroke-orange-400 fill-transparent opacity-50 stroke-2"
    stroke-linecap='square'
  ></path>
  <GraphText
    :position="textPosition"
    :alignX="textPosition.x > 0 ? 'left' : 'right'"
    :alignY="textPosition.y > 0 ? 'top' : 'bottom'"
    :text="secantEquation"
    color="#fb923c"
  />
</template>