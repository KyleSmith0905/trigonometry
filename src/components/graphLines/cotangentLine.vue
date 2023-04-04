<script setup lang="ts">
  import { useDraggablePoints } from '@/stores/draggablePoints';
  import { mapToGraph, pointsAngle, pointsDistance, pointsToSlope, rayTraceToWall } from '@/helpers/graph';
  import { ref } from 'vue';
  import { radiansToDegrees, roundNumbers } from '@/helpers/math';
  import { useFunctionsSettings } from '@/stores/functionsSettings';
  import { useGraphDimensions } from '@/stores/graphDimensions';

  const draggablePointsStore = useDraggablePoints();
  const functionsSettingsStore = useFunctionsSettings();
  const graphDimensionsStore = useGraphDimensions();

  const cotangentPointTop = ref({x: 0, y: 0});
  const cotangentPointAxis = ref({x: 0, y: 0});
  const textPosition = ref({x: 0, y: 0})
  const cotangentEquation = ref('');

  const updateDraggablePoints = (newStore: typeof draggablePointsStore) => {
    const points = newStore.points;
    const cotangentPoint = newStore.cotangentPoint;
    const angle = newStore.angle;

    const angleAngle = pointsAngle(points.main, points.angle);

    // Gets the position of the tangent point
    const unitCircleRadius = pointsDistance(points.main, points.angle);

    // Bounds the axis to two points: +y and -y
    const chosenAxis = (Math.round((angle / Math.PI) + 0.5) - 0.5) * Math.PI + Math.PI;
    // Shift the angle around to account for different angles
    const adjustedAxis = chosenAxis + angleAngle - angle;
    cotangentPointAxis.value = {
      x: (Math.cos(adjustedAxis) * unitCircleRadius) + points.main.x,
      y: (Math.sin(adjustedAxis) * unitCircleRadius) + points.main.y,
    }

    // Bounds the main tangent line to the top
    const slopeData = pointsToSlope(cotangentPoint, cotangentPointAxis.value);
    cotangentPointTop.value = rayTraceToWall(slopeData, cotangentPointAxis.value, graphDimensionsStore.walls);
    if (pointsDistance(cotangentPoint, cotangentPointAxis.value) < pointsDistance(cotangentPointTop.value, cotangentPointAxis.value)) {
      cotangentPointTop.value = cotangentPoint;
    }

    // Calculate a good position to show text
    textPosition.value = {
      x: cotangentPointTop.value.x * 0.5  + cotangentPointAxis.value.x * 0.5,
      y: cotangentPointTop.value.y * 0.5  + cotangentPointAxis.value.y * 0.5,
    }

    // Writes the equation into 
    const equation = `cotangent(${roundNumbers(radiansToDegrees(angle))}°)`;
    const answer = `${roundNumbers(1 / Math.tan(angle), 1)}`;
    if (functionsSettingsStore.cotangent.equation === 'answer') cotangentEquation.value = answer;
    if (functionsSettingsStore.cotangent.equation === 'equation') cotangentEquation.value = equation;
    if (functionsSettingsStore.cotangent.equation === 'full') cotangentEquation.value = [equation, answer].join(' = ');
  }
  setTimeout(() => {
    updateDraggablePoints(draggablePointsStore);
  });
  draggablePointsStore.$onAction((pointsData) => updateDraggablePoints(pointsData.store));
  functionsSettingsStore.$onAction(() => setTimeout(() => updateDraggablePoints(draggablePointsStore)));
</script>

<template>
  <path
    :d="`M${mapToGraph(cotangentPointTop)} L${mapToGraph(cotangentPointAxis)}`"
    class="stroke-green-400 fill-transparent opacity-50 stroke-2"
    stroke-linecap='square'
  ></path>
  <text
    :x="mapToGraph(textPosition, 'x')"
    :y="mapToGraph(textPosition, 'y')"
    :dy="textPosition.y > 0 ? -20 : 20"
    :dominant-baseline="draggablePointsStore.points.angle.y > 0 ? 'text-top' : 'hanging'"
    text-anchor="middle"
    stroke-linecap='square'
    class="graph-text fill-green-400"
  >{{ cotangentEquation }}</text>
</template>