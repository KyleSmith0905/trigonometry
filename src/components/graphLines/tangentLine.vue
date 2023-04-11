<script setup lang="ts">
  import { useDraggablePoints } from '@/stores/draggablePoints';
  import { mapToGraph, pointsAngle, pointsDistance, pointsToSlope, rayTraceToWall } from '@/helpers/graph';
  import { ref } from 'vue';
  import { radiansToDegrees, roundNumbers } from '@/helpers/math';
  import { useFunctionsSettings } from '@/stores/functionsSettings';
  import { useGraphDimensions } from '@/stores/graphDimensions';
  import GraphText from '../GraphText.vue';

  const draggablePointsStore = useDraggablePoints();
  const functionsSettingsStore = useFunctionsSettings();
  const graphDimensionsStore = useGraphDimensions();

  const tangentPointTop = ref({x: 0, y: 0});
  const tangentPointAxis = ref({x: 0, y: 0});
  const textPosition = ref({x: 0, y: 0})
  const tangentEquation = ref('');

  const updateDraggablePoints = (newStore: typeof draggablePointsStore) => {
    const points = newStore.points;
    const tangentPoint = newStore.tangentPoint;
    const angle = newStore.angle;

    const angleAngle = pointsAngle(points.main, points.angle);

    // Gets the position of the tangent point
    const unitCircleRadius = pointsDistance(points.main, points.angle);

    // Snaps the point to the x-axis
    const adjustedAngle = Math.round(angle / Math.PI) * Math.PI + angleAngle - angle + Math.PI;
    tangentPointAxis.value = {
      x: (Math.cos(adjustedAngle) * unitCircleRadius) + points.main.x,
      y: (Math.sin(adjustedAngle) * unitCircleRadius) + points.main.y,
    }

    // Bounds the main tangent line to the top
    const slopeData = pointsToSlope(tangentPoint, tangentPointAxis.value);
    tangentPointTop.value = rayTraceToWall(slopeData, tangentPointAxis.value, graphDimensionsStore.walls);
    if (pointsDistance(tangentPoint, tangentPointAxis.value) < pointsDistance(tangentPointTop.value, tangentPointAxis.value)) {
      tangentPointTop.value = tangentPoint;
    }

    // Calculate a good position to show text
    textPosition.value = {
      x: tangentPointTop.value.x * 0.5  + tangentPointAxis.value.x * 0.5,
      y: tangentPointTop.value.y * 0.5  + tangentPointAxis.value.y * 0.5,
    }

    // Writes the equation into 
    const equation = `tangent(${roundNumbers(radiansToDegrees(angle))}°)`;
    const answer = `${roundNumbers(Math.tan(angle), 1)}`;

    if (functionsSettingsStore.tangent.equation === 'answer') tangentEquation.value = answer;
    if (functionsSettingsStore.tangent.equation === 'equation') tangentEquation.value = equation;
    if (functionsSettingsStore.tangent.equation === 'full') tangentEquation.value = [equation, answer].join(' = ');
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
    :d="`M${mapToGraph(tangentPointTop)} L${mapToGraph(tangentPointAxis)}`"
    class="stroke-yellow-400 fill-transparent opacity-50 stroke-2"
    stroke-linecap='square'
  ></path>
  <GraphText
    :position="textPosition"
    :alignX="textPosition.x > 0 ? 'left' : 'right'"
    :alignY="textPosition.y > 0 ? 'top' : 'bottom'"
    :text="tangentEquation"
    color="#facc15"
  />
</template>