<script setup lang="ts">
  import { useDraggablePoints, type Points } from '@/stores/draggablePoints';
  import { mapToGraph, pointsAngle, pointsDistance, pointsToSlope, rayTraceToWall } from '@/helpers/graph';
  import { ref } from 'vue';
  import { useFunctionsSettings } from '@/stores/functionsSettings';
  import { useGraphDimensions } from '@/stores/graphDimensions';
  import GraphText from '../GraphText.vue';
  import { writeEquation } from '@/helpers/string';

  const draggablePointsStore = useDraggablePoints();
  const functionsSettingsStore = useFunctionsSettings();
  const graphDimensionsStore = useGraphDimensions();

  const cotangentPointTop = ref({x: 0, y: 0});
  const cotangentPointAxis = ref({x: 0, y: 0});
  const textPosition = ref({x: 0, y: 0})
  const cotangentEquation = ref('');

  const updateDraggablePoints = (points: Points) => {
    const yRightAnglePoint = draggablePointsStore.calculateYRightAnglePoint(points);
    const cotangentPoint = draggablePointsStore.calculateCotangentPoint(points, yRightAnglePoint);
    const angle = draggablePointsStore.calculateAngle(points);

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

    cotangentEquation.value = writeEquation(functionsSettingsStore.cotangent, (angle) => 1 / Math.tan(angle))
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
    :d="`M${mapToGraph(cotangentPointTop)} L${mapToGraph(cotangentPointAxis)}`"
    class="stroke-purple-400 fill-transparent opacity-50 stroke-2"
    stroke-linecap='square'
  ></path>
  <GraphText
    :position="textPosition"
    :alignX="textPosition.x <= 0 ? 'left' : 'right'"
    :alignY="textPosition.y <= 0 ? 'top' : 'bottom'"
    :text="cotangentEquation"
    color="#c084fc"
  />
</template>