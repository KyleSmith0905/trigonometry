<script setup lang="ts">
  import { useDraggablePoints } from '@/stores/draggablePoints';
  import { convertBoxToWalls, mapToGraph, pointsAngle, pointsDistance, pointsToSlope, rayTraceToWall } from '@/helpers/graph';
  import { ref } from 'vue';
  import { radiansToDegrees, roundNumbers } from '@/helpers/math';
  import { useFunctionsSettings } from '@/stores/functionsSettings';

  const draggablePointsStore = useDraggablePoints();
  const functionsSettingsStore = useFunctionsSettings();

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

    const boxBorder = convertBoxToWalls({
      top: window.innerHeight * -0.02,
      left: window.innerWidth * -0.02,
      bottom: window.innerHeight * 0.02,
      right: window.innerWidth * 0.02,
    });

    // Bounds the main tangent line to the top
    const slopeData = pointsToSlope(tangentPoint, tangentPointAxis.value);
    tangentPointTop.value = rayTraceToWall(slopeData, tangentPointAxis.value, boxBorder);
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
</script>

<template>
  <path
    :d="`M${mapToGraph(tangentPointTop)} L${mapToGraph(tangentPointAxis)}`"
    class="stroke-yellow-400 fill-transparent opacity-50 stroke-2"
    stroke-linecap='square'
  ></path>
  <text
    :x="mapToGraph(textPosition, 'x')"
    :y="mapToGraph(textPosition, 'y')"
    :dx="textPosition.x > 0 ? 20 : -20"
    :text-anchor="textPosition.x > 0 ? 'start' : 'end'"
    :dominant-baseline="draggablePointsStore.points.angle.y > 0 ? 'hanging' : 'text-top'"
    stroke-linecap='square'
    class="graph-text fill-yellow-400"
  >{{ tangentEquation }}</text>
</template>