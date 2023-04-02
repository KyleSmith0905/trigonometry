<script setup lang="ts">
  import { useDraggablePoints } from '@/stores/draggablePoints';
  import { mapToGraph } from '@/helpers/graph';

  const draggablePointsStore = useDraggablePoints();
</script>

<template>
  <path
    :d="`M${mapToGraph(draggablePointsStore.points.main)} L${mapToGraph(draggablePointsStore.xRightAnglePoint)} L${mapToGraph(draggablePointsStore.points.angle)} Z`"
    class="stroke-slate-600 fill-transparent opacity-20 stroke-2"
    stroke-linecap='square'
  ></path>
</template>