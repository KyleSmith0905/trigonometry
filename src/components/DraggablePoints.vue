<script setup lang="ts">
  import { useDraggablePoints, type PointNames } from '../stores/draggablePoints';
  import { useGridMode, type GridModes } from '@/stores/gridMode';
  import { ref } from 'vue';
  import { pointsAngle, pointsDistance, mapToGraph } from '@/helpers/graph';
  import { useGraphDimensions } from '@/stores/graphDimensions';
  import { Device, type DeviceInfo } from '@capacitor/device';

  const draggablePointsStore = useDraggablePoints();
  const gridModeStore = useGridMode();
  const graphDimensions = useGraphDimensions();

  const deviceInfoPromise = Device.getInfo();
  const deviceInfo = ref<DeviceInfo | null>(null);
  const isMobileDevice = ref(false);
  deviceInfoPromise.then((deviceInfoResolve) => {
    deviceInfo.value = deviceInfoResolve;
    isMobileDevice.value = ['ios', 'android'].includes(deviceInfo.value.operatingSystem);
  })

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
  <div class="absoluter top-0 w-full h-full overflow-hidden">
    <template v-for="(value, pointName) in draggablePointsStore.points">
      <div
        v-if="pointsLocal[pointName].visible"
        @touchstart="dragStart($event, pointName)"
        @mousedown="dragStart($event, pointName)"
        :key="pointName"
        :style="{top: `${mapToGraph(value, 'y')}px`, left: `${mapToGraph(value, 'x')}px`}"
        :class="{
          'absolute bg-slate-800 rounded-full transition-transform cursor-pointer select-none': true,
          'w-4 h-4 -ml-2 -mt-2': !isMobileDevice,
          'w-8 h-8 -ml-4 -mt-4': isMobileDevice,
          'scale-150': activePointName === pointName,
        }"
      ></div>
    </template>
  </div>
</template>