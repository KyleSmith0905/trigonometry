<script setup lang="ts">
  import { useDraggablePoints } from '@/stores/draggablePoints';
  import { pointsDistance, mapToGraph } from '@/helpers/graph';
  import { ref } from 'vue';

  const draggablePointsStore = useDraggablePoints();

  const distance = ref(0);
  const center = ref({x: 0, y: 0});
  const updateDraggablePoints = (points: typeof draggablePointsStore.points) => {
    distance.value = pointsDistance(points.main, points.angle) * 25;
    center.value = {
      x: points.main.x + distance.value,
      y: points.main.y + distance.value,
    }
  }
  setTimeout(() => {
    updateDraggablePoints(draggablePointsStore.points);
  });
  draggablePointsStore.$subscribe((_actionData, pointsData) => updateDraggablePoints(pointsData.points));
</script>

<template>
  <circle
    :cx="mapToGraph(draggablePointsStore.points.main, 'x')"
    :cy="mapToGraph(draggablePointsStore.points.main, 'y')"
    :r="distance"
    class="stroke-slate-400 fill-transparent opacity-50 stroke-2"
  ></circle>
</template>