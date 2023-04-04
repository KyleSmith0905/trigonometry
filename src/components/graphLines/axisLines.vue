<script setup lang="ts">
  import { useDraggablePoints } from '@/stores/draggablePoints';
  import { invertSlopeOnPoint, pointsToSlope, mapToGraph, rayTraceToWall } from '@/helpers/graph';
  import { ref } from 'vue';
import { useGraphDimensions } from '@/stores/graphDimensions';

  const draggablePointsStore = useDraggablePoints();
  const graphDimensionsStore = useGraphDimensions();

  // Update lines showing points between two values.
  const startXAxis = ref({x: 0, y: 0});
  const endXAxis = ref({x: 0, y: 0});
  const startYAxis = ref({x: 0, y: 0});
  const endYAxis = ref({x: 0, y: 0});
  const updateDraggablePoints = (points: typeof draggablePointsStore.points) => {
    const boxBorder = graphDimensionsStore.walls;

    const xAxisLine = pointsToSlope(points.main, points.axis);
    startXAxis.value = rayTraceToWall(xAxisLine, points.main, boxBorder);
    endXAxis.value = rayTraceToWall({...xAxisLine, direction: xAxisLine.direction === 'left' ? 'right' : 'left'}, points.main, boxBorder);
    const yAxisLine = invertSlopeOnPoint(xAxisLine, points.main);
    startYAxis.value = rayTraceToWall(yAxisLine, points.main, boxBorder);
    endYAxis.value = rayTraceToWall({...yAxisLine, direction: yAxisLine.direction === 'left' ? 'right' : 'left'}, points.main, boxBorder);
  }
  setTimeout(() => {
    updateDraggablePoints(draggablePointsStore.points);
  });
  draggablePointsStore.$subscribe((_actionData, pointsData) => updateDraggablePoints(pointsData.points));
  graphDimensionsStore.$subscribe(() => updateDraggablePoints(draggablePointsStore.points));
</script>

<template>
  <path
    :d="`M${mapToGraph(startXAxis)} L${mapToGraph(endXAxis)}`"
    class="stroke-slate-500 fill-transparent opacity-100 stroke-2"
    stroke-linecap='square'
  ></path>
  <path
    :d="`M${mapToGraph(startYAxis)} L${mapToGraph(endYAxis)}`"
    class="stroke-slate-500 fill-transparent opacity-100 stroke-2"
    stroke-linecap='square'
  ></path>
  <text
    :x="mapToGraph(startXAxis, 'x')" :y="mapToGraph(startXAxis, 'y')"
    :dx="startXAxis.x > 0 ? -20 : 20"
    :dy="startXAxis.y > 0 ? 20 : -20"
    text-anchor="middle"
    dominant-baseline="middle"
    class="graph-text"
  >-x</text>
  <text
    :x="mapToGraph(endXAxis, 'x')" :y="mapToGraph(endXAxis, 'y')"
    :dx="endXAxis.x > 0 ? -20 : 20"
    :dy="endXAxis.y > 0 ? 20 : -20"
    text-anchor="middle"
    dominant-baseline="middle"
    class="graph-text"
  >+x</text>
  <text
    :x="mapToGraph(startYAxis, 'x')" :y="mapToGraph(startYAxis, 'y')"
    :dx="startYAxis.x > 0 ? -20 : 20"
    :dy="startYAxis.y > 0 ? 20 : -20"
    text-anchor="middle"
    dominant-baseline="middle"
    class="graph-text"
  >-y</text>
  <text
    :x="mapToGraph(endYAxis, 'x')" :y="mapToGraph(endYAxis, 'y')"
    :dx="endYAxis.x > 0 ? -20 : 20"
    :dy="endYAxis.y > 0 ? 20 : -20"
    text-anchor="middle"
    dominant-baseline="middle"
    class="graph-text"
  >+y</text>
</template>

<style scoped>
  .axis-label {
    text-shadow:
      0rem 0rem 0.6rem theme('colors.slate.100'),
      0rem 0rem 0.6rem theme('colors.slate.100'),
      0rem 0rem 0.6rem theme('colors.slate.100'),
      0rem 0rem 0.6rem theme('colors.slate.100'),
      0rem 0rem 0.6rem theme('colors.slate.100'),
      0rem 0rem 0.6rem theme('colors.slate.100'),
      0rem 0rem 0.6rem theme('colors.slate.100'),
      0rem 0rem 0.6rem theme('colors.slate.100'),
      0rem 0rem 0.6rem theme('colors.slate.100')
  }
</style>
