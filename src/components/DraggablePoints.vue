<script setup lang="ts">
  import { useDraggablePoints, type PointNames } from '../stores/draggablePoints';
  import { useGridMode, type GridModes } from '@/stores/gridMode';
  import { ref } from 'vue';
  import { pointsAngle, pointsDistance } from '@/helpers/graph';
  import { useGraphDimensions } from '@/stores/graphDimensions';

  const draggablePointsStore = useDraggablePoints();
  const gridModeStore = useGridMode();
  const graphDimensions = useGraphDimensions();

  const activePointName = ref<PointNames | null>(null);
  const pointsLocal = ref({
    main: {
      visible: true
    },
    axis: {
      visible: true
    },
    angle: {
      visible: true,
      lock: false as {distance: number, point: PointNames} | false,
    },
  }) 

  const gridModeChanged = (gridMode: GridModes) => {
    if (gridMode === 'polar') {
      const lockDistance = pointsDistance(draggablePointsStore.points.main, draggablePointsStore.points.angle);
      pointsLocal.value = {
        main: {visible: false},
        axis: {visible: false},
        angle: {
          visible: true,
          lock: {distance: lockDistance, point: 'main'}
        },
      }
    }
    else {
      pointsLocal.value = {
        main: {visible: true},
        axis: {visible: true},
        angle: {visible: true, lock: false},
      }
    }
  }
  gridModeStore.$subscribe((_actionData, gridData) => gridModeChanged(gridData.gridMode))

  const dragStart = (event: MouseEvent | TouchEvent, pointName: PointNames) => {
    activePointName.value = pointName;
    event.preventDefault()
    
    window.addEventListener('touchend', dragEnd);
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('touchmove', drag);
    window.addEventListener('mousemove', drag);
  }

  // When user releases, snap the point to the grid
  const dragEnd = async () => {
    window.removeEventListener('touchend', dragEnd);
    window.removeEventListener('mouseup', dragEnd);
    window.removeEventListener('touchmove', drag);
    window.removeEventListener('mousemove', drag);

    if (!activePointName.value) return;

    const point = draggablePointsStore.points[activePointName.value];
    const pointLocal = pointsLocal.value[activePointName.value];

    if ('lock' in pointLocal && pointLocal.lock !== false) {
      // Only allow rotational dragging around a point
      const lockPoint = draggablePointsStore.points[pointLocal.lock.point];
      const angle = pointsAngle(point, lockPoint);
      draggablePointsStore.setPoint(activePointName.value, {
        x: Math.cos(angle) * pointLocal.lock.distance + lockPoint.x,
        y: Math.sin(angle) * pointLocal.lock.distance + lockPoint.y,
      });
    }
    else {
      // Free drag the point around freely while snapping to a point
      draggablePointsStore.setPoint(activePointName.value, {
        x: Math.round(point.x),
        y: Math.round(point.y),
      });
    }
    activePointName.value = null;
  }

  // Moves the draggable points around as the mouse is moving
  const drag = (event: MouseEvent | TouchEvent) => {
    if (!activePointName.value) return;
    // Gets coordinates from touch and mouse effects
    let mouseX = 0;
    let mouseY = 0;
    if (event instanceof MouseEvent) {
      mouseX = event.clientX - graphDimensions.dimensions.left - (graphDimensions.dimensions.width * 0.5);
      mouseY = -1 * (event.clientY - graphDimensions.dimensions.top - (graphDimensions.dimensions.height * 0.5));
    }
    else {
      mouseX = event.touches[0].clientX - graphDimensions.dimensions.left - (graphDimensions.dimensions.width * 0.5);
      mouseY = -1 * (event.touches[0].clientY - graphDimensions.dimensions.top - (graphDimensions.dimensions.height * 0.5));
    }
    
    // Reduces the points range to the range of the grid
    const point = {
      x: mouseX * 0.04,
      y: mouseY * 0.04,
    }

    const pointLocal = pointsLocal.value[activePointName.value];
    if ('lock' in pointLocal && pointLocal.lock !== false) {
      // Only allow rotational dragging around a point
      const lockPoint = draggablePointsStore.points[pointLocal.lock.point];
      const angle = pointsAngle(point, lockPoint);
      draggablePointsStore.setPoint(activePointName.value, {
        x: Math.cos(angle) * pointLocal.lock.distance + lockPoint.x,
        y: Math.sin(angle) * pointLocal.lock.distance + lockPoint.y,
      });
    }
    else {
      // Free drag the point around freely while snapping to a point
      draggablePointsStore.setPoint(activePointName.value, {
        x: point.x * 0.7 + Math.round(point.x) * 0.3,
        y: point.y * 0.7 + Math.round(point.y) * 0.3,
      });
    }
  }
</script>

<template>
  <div class="absolute flex items-center justify-center w-full h-full overflow-hidden">
    <template v-for="(value, pointName) in draggablePointsStore.points">
      <div
        v-if="pointsLocal[pointName].visible"
        @touchstart="dragStart($event, pointName)"
        @mousedown="dragStart($event, pointName)"
        :key="pointName"
        :style="{marginBottom: `${value.y * 50}px`, marginLeft: `${value.x * 50}px`}"
        :class="{
          'absolute w-4 h-4 bg-slate-800 ring-2 ring-slate-900 rounded-full transition-transform cursor-pointer': true,
          'scale-150': activePointName === pointName,
        }"
      ></div>
    </template>
  </div>
</template>