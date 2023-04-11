<script setup lang="ts">
  import { useDraggablePoints } from '@/stores/draggablePoints';
  import { invertSlopeOnPoint, pointsToSlope, mapToGraph, rayTraceToWall } from '@/helpers/graph';
  import { ref } from 'vue';
  import { useGraphDimensions } from '@/stores/graphDimensions';
  import { xor } from '@/helpers/logic';
  import GraphText from '../GraphText.vue';

  const draggablePointsStore = useDraggablePoints();
  const graphDimensionsStore = useGraphDimensions();

  // Update lines showing points between two values.
  const startXAxis = ref({x: 0, y: 0});
  const endXAxis = ref({x: 0, y: 0});
  const startYAxis = ref({x: 0, y: 0});
  const endYAxis = ref({x: 0, y: 0});

  const updateDraggablePoints = (points: typeof draggablePointsStore.points) => {
    const boxBorder = graphDimensionsStore.walls;

    const invertDirection = (direction: 'left' | 'right') => direction === 'left' ? 'right' : 'left'

    const xAxisLine = pointsToSlope(points.main, points.axis);
    startXAxis.value = rayTraceToWall(xAxisLine, points.main, boxBorder);
    endXAxis.value = rayTraceToWall({...xAxisLine, direction: invertDirection(xAxisLine.direction)}, points.main, boxBorder);

    const yAxisLine = invertSlopeOnPoint(xAxisLine, points.main);

    startYAxis.value = rayTraceToWall(
      {...yAxisLine, direction: xor(Math.abs(yAxisLine.slope) === Infinity ? yAxisLine.slope > 0 : yAxisLine.slope <= 0, yAxisLine.direction === 'left') ? 'left' : 'right'},
      points.main,
      boxBorder,
    );

    endYAxis.value = rayTraceToWall(
      {...yAxisLine, direction: xor(Math.abs(yAxisLine.slope) === Infinity ? yAxisLine.slope > 0 : yAxisLine.slope <= 0, yAxisLine.direction === 'left') ? 'right' : 'left'},
      points.main,
      boxBorder,
    );
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
  <GraphText
    :position="startXAxis"
    :alignX="startXAxis.x < 0 ? 'right' : 'left'"
    :alignY="startXAxis.y < 0 ? 'top' : 'bottom'"
    text="-x"
  />
  <GraphText
    :position="endXAxis"
    :alignX="endXAxis.x > 0 ? 'right' : 'left'"
    :alignY="endXAxis.y > 0 ? 'top' : 'bottom'"
    text="+x"
  />
  <GraphText
    :position="startYAxis"
    :alignX="startYAxis.x > 0 ? 'right' : 'left'"
    :alignY="startYAxis.y > 0 ? 'top' : 'bottom'"
    text="+y"
  />
  <GraphText
    :position="endYAxis"
    :alignX="endYAxis.x > 0 ? 'right' : 'left'"
    :alignY="endYAxis.y > 0 ? 'top' : 'bottom'"
    text="-y"
  />
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
