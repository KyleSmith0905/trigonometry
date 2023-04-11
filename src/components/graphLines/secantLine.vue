<script setup lang="ts">
  import { useDraggablePoints, type Points } from '@/stores/draggablePoints';
  import { mapToGraph, pointsDistance, pointsToSlope, rayTraceToWall } from '@/helpers/graph';
  import { ref } from 'vue';
  import { useFunctionsSettings } from '@/stores/functionsSettings';
  import { useGraphDimensions } from '@/stores/graphDimensions';
  import GraphText from '../GraphText.vue';
  import { writeEquation } from '@/helpers/string';

  const draggablePointsStore = useDraggablePoints();
  const functionsSettingsStore = useFunctionsSettings();
  const graphDimensionsStore = useGraphDimensions();

  const tangentPointAngle = ref({x: 0, y: 0});
  const textPosition = ref({x: 0, y: 0})
  const secantEquation = ref('');

  const updateDraggablePoints = (points: Points) => {
    const xRightAnglePoint = draggablePointsStore.calculateXRightAnglePoint(points);
    const tangentPoint = draggablePointsStore.calculateTangentPoint(points, xRightAnglePoint);

    // Bounds the line connecting the tangent and the angle point.
    const angleSlopeData = pointsToSlope(tangentPoint, points.main);
    tangentPointAngle.value = rayTraceToWall(angleSlopeData, points.main, graphDimensionsStore.walls);
    if (pointsDistance(tangentPoint, points.main) < pointsDistance(tangentPointAngle.value, points.main)) {
      tangentPointAngle.value = tangentPoint;
    }

    // Calculate a good position to show text
    textPosition.value = {
      x: tangentPointAngle.value.x * 0.5  + points.main.x * 0.5,
      y: tangentPointAngle.value.y * 0.5  + points.main.y * 0.5,
    }

    secantEquation.value = writeEquation(functionsSettingsStore.secant, (angle) => 1 / Math.cos(angle))
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