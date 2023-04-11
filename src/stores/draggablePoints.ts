import { computed, ref } from 'vue'
import { defineStore,  } from 'pinia'
import { pointIntersectionOnAxis, pointsAngle, pointsDistance } from '@/helpers/graph';
import { useGraphDimensions } from './graphDimensions';
import { clamp } from '@/helpers/math';

export type PointNames = 'main' | 'axis' | 'angle';

export type Points = Record<PointNames, {x: number, y: number}>;

export const useDraggablePoints = defineStore('draggablePoints', () => {
  const graphDimensionsStore = useGraphDimensions();

  const points = ref({main: {x: 0, y: 0}, axis: {x: 3, y: 0}, angle: {x: 3, y: 4}});

  // Gets the position of the right angle on the triangle
  const calculateXRightAnglePoint = (newPoints: typeof points.value) => {
    const xAxisAngle = pointsAngle(newPoints.main, newPoints.axis);
    const intersection = pointIntersectionOnAxis(newPoints.main, xAxisAngle, newPoints.angle);
    
    if (!intersection) return {x: 0, y: 0};
    return intersection
  }
  const xRightAnglePoint = computed(() => calculateXRightAnglePoint(points.value))

  // Gets the position of the right angle on the triangle
  const calculateYRightAnglePoint = (newPoints: typeof points.value) => {
    const xAxisAngle = pointsAngle(newPoints.main, newPoints.axis) + Math.PI * 0.5;
    const intersection = pointIntersectionOnAxis(newPoints.main, xAxisAngle, newPoints.angle);
    
    if (!intersection) return {x: 0, y: 0};
    return intersection
  }
  const yRightAnglePoint = computed(() => calculateYRightAnglePoint(points.value))
  
  // Gets a point that intersects the hypotenuse and the unit-circle x-axis bounds.
  const calculateTangentPoint = (newPoints: typeof points.value, xRightAnglePoint: {x: number, y: number}) => {
    const rightAngleMultiply = pointsDistance(newPoints.main, xRightAnglePoint);
    const angleAngle = pointsAngle(newPoints.main, newPoints.angle);
    const unitCircleRadius = pointsDistance(newPoints.main, newPoints.angle);

    const unboundedTangentPoint = {
      x: (Math.cos(angleAngle + Math.PI) * (unitCircleRadius / rightAngleMultiply) * unitCircleRadius) + newPoints.main.x,
      y: (Math.sin(angleAngle + Math.PI) * (unitCircleRadius / rightAngleMultiply) * unitCircleRadius) + newPoints.main.y,
    }

    return unboundedTangentPoint;
  }
  const tangentPoint = computed(() => calculateTangentPoint(points.value, xRightAnglePoint.value));
  
    
  // Gets a point that intersects the hypotenuse and the unit-circle y-axis bounds.
  const calculateCotangentPoint = (newPoints: typeof points.value, yRightAnglePoint: {x: number, y: number}) => {
    const rightAngleMultiply = pointsDistance(newPoints.main, yRightAnglePoint);
    const angleAngle = pointsAngle(newPoints.main, newPoints.angle);
    const unitCircleRadius = pointsDistance(newPoints.main, newPoints.angle);

    const unboundedTangentPoint = {
      x: (Math.cos(angleAngle + Math.PI) * (unitCircleRadius / rightAngleMultiply) * unitCircleRadius) + newPoints.main.x,
      y: (Math.sin(angleAngle + Math.PI) * (unitCircleRadius / rightAngleMultiply) * unitCircleRadius) + newPoints.main.y,
    }

    return unboundedTangentPoint;
  }
  const cotangentPoint = computed(() => calculateCotangentPoint(points.value, yRightAnglePoint.value));

  // Gets the angle needed for trigonometry functions
  const calculateAngle = (newPoints: typeof points.value) => {
    const axisAngle = pointsAngle(newPoints.main, newPoints.axis);
    const angleAngle = pointsAngle(newPoints.main, newPoints.angle);
    const triangleAngle = (angleAngle - axisAngle + Math.PI * 2) % (Math.PI * 2);
    
    return triangleAngle;
  }
  const angle = computed(() => calculateAngle(points.value));

  const calculateUnitScale = (newPoints: typeof points.value) => {
    return pointsDistance(newPoints.main, newPoints.angle);
  }
  const unitScale = computed(() => calculateUnitScale(points.value));

  // Sets the point and clamps it between bounds
  const setPoint = (pointName: PointNames, pointData: {x: number, y: number}) => {
    const boundingBox = graphDimensionsStore.boundingBox;
    points.value[pointName] = {
      x: clamp(pointData.x, boundingBox.left + 0.1, boundingBox.right - 0.1),
      y: clamp(pointData.y, boundingBox.top + 0.1, boundingBox.bottom - 0.1),
    }
  }

  return {
    points, setPoint,
    xRightAnglePoint, calculateXRightAnglePoint,
    yRightAnglePoint, calculateYRightAnglePoint,
    tangentPoint, calculateTangentPoint,
    cotangentPoint, calculateCotangentPoint,
    angle, calculateAngle,
    unitScale, calculateUnitScale,
  }
})
