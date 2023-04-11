<script setup lang="ts">
  import { useDraggablePoints, type Points } from '@/stores/draggablePoints';
  import { useFunctionsSettings } from '@/stores/functionsSettings';
  import { mapToGraph, pointsDistance, pointsToSlope, rayTraceToWall } from '@/helpers/graph';
  import { ref } from 'vue';
  import { useGraphDimensions } from '@/stores/graphDimensions';
  import GraphText from '../GraphText.vue';
  import { writeEquation } from '@/helpers/string';

  const draggablePointsStore = useDraggablePoints();
  const functionsSettingsStore = useFunctionsSettings();
  const graphDimensionsStore = useGraphDimensions();

  const cotangentPointAngle = ref({x: 0, y: 0});
  const textPosition = ref({x: 0, y: 0})
  const cosecantEquation = ref('');

  const updateDraggablePoints = (points: Points) => {
    const yRightAnglePoint = draggablePointsStore.calculateYRightAnglePoint(points);
    const cotangentPoint = draggablePointsStore.calculateCotangentPoint(points, yRightAnglePoint);

    // Bounds the line connecting the tangent and the angle point.
    const angleSlopeData = pointsToSlope(cotangentPoint, points.main);
    cotangentPointAngle.value = rayTraceToWall(angleSlopeData, points.main, graphDimensionsStore.walls);
    if (pointsDistance(cotangentPoint, points.main) < pointsDistance(cotangentPointAngle.value, points.main)) {
      cotangentPointAngle.value = cotangentPoint;
    }

    // Calculate a good position to show text
    textPosition.value = {
      x: cotangentPointAngle.value.x * 0.5  + points.main.x * 0.5,
      y: cotangentPointAngle.value.y * 0.5  + points.main.y * 0.5,
    }

    cosecantEquation.value = writeEquation(functionsSettingsStore.cosecant, (angle) => 1 / Math.sin(angle))
  }
  setTimeout(() => {
    updateDraggablePoints(draggablePointsStore.points);
  });
  draggablePointsStore.$subscribe((_, pointsData) => updateDraggablePoints(pointsData.points));
  functionsSettingsStore.$subscribe(() => updateDraggablePoints(draggablePointsStore.points));
  graphDimensionsStore.$subscribe(() => updateDraggablePoints(draggablePointsStore.points));
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