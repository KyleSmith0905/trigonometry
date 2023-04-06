import { computed, ref } from 'vue'
import { defineStore,  } from 'pinia'
import { pointIntersectionOnAxis, pointsAngle, pointsDistance } from '@/helpers/graph';
import { useGraphDimensions } from './graphDimensions';
import { clamp } from '@/helpers/math';

export type PointNames = 'main' | 'axis' | 'angle';

export const useDraggablePoints = defineStore('draggablePoints', () => {
  const graphDimensionsStore = useGraphDimensions();

  const points = ref({main: {x: 0, y: 0}, axis: {x: 3, y: 0}, angle: {x: 3, y: 4}});

  // Gets the position of the right angle on the triangle
  const xRightAnglePoint = computed(() => {
    const xAxisAngle = pointsAngle(points.value.main, points.value.axis);
    const intersection = pointIntersectionOnAxis(points.value.main, xAxisAngle, points.value.angle);
    
    if (!intersection) return {x: 0, y: 0};
    return intersection
  })

  // Gets the position of the right angle on the triangle
  const yRightAnglePoint = computed(() => {
    const xAxisAngle = pointsAngle(points.value.main, points.value.axis) + Math.PI * 0.5;
    const intersection = pointIntersectionOnAxis(points.value.main, xAxisAngle, points.value.angle);
    
    if (!intersection) return {x: 0, y: 0};
    return intersection
  })
  
  // Gets a point that intersects the hypotenuse and the unit-circle x-axis bounds.
  const tangentPoint = computed(() => {
    const rightAngleMultiply = pointsDistance(points.value.main, xRightAnglePoint.value);
    const angleAngle = pointsAngle(points.value.main, points.value.angle);
    const unitCircleRadius = pointsDistance(points.value.main, points.value.angle);

    const unboundedTangentPoint = {
      x: (Math.cos(angleAngle + Math.PI) * (unitCircleRadius / rightAngleMultiply) * unitCircleRadius) + points.value.main.x,
      y: (Math.sin(angleAngle + Math.PI) * (unitCircleRadius / rightAngleMultiply) * unitCircleRadius) + points.value.main.y,
    }

    return unboundedTangentPoint;
  })
  
  // Gets a point that intersects the hypotenuse and the unit-circle y-axis bounds.
  const cotangentPoint = computed(() => {
    const rightAngleMultiply = pointsDistance(points.value.main, yRightAnglePoint.value);
    const angleAngle = pointsAngle(points.value.main, points.value.angle);
    const unitCircleRadius = pointsDistance(points.value.main, points.value.angle);

    const unboundedTangentPoint = {
      x: (Math.cos(angleAngle + Math.PI) * (unitCircleRadius / rightAngleMultiply) * unitCircleRadius) + points.value.main.x,
      y: (Math.sin(angleAngle + Math.PI) * (unitCircleRadius / rightAngleMultiply) * unitCircleRadius) + points.value.main.y,
    }

    return unboundedTangentPoint;
  })

  // Gets the angle needed for trigonometry functions
  const angle = computed(() => {
    const axisAngle = pointsAngle(points.value.main, points.value.axis);
    const angleAngle = pointsAngle(points.value.main, points.value.angle);
    const triangleAngle = (angleAngle - axisAngle + Math.PI * 2) % (Math.PI * 2);
    
    return triangleAngle;
  })

  const setPoint = (pointName: PointNames, pointData: {x: number, y: number}) => {
    const boundingBox = graphDimensionsStore.boundingBox;
    points.value[pointName] = {
      x: clamp(pointData.x, boundingBox.left + 0.1, boundingBox.right - 0.1),
      y: clamp(pointData.y, boundingBox.top + 0.1, boundingBox.bottom - 0.1),
    }
  }

  return {points, xRightAnglePoint, yRightAnglePoint, tangentPoint, cotangentPoint, angle, setPoint}
})
