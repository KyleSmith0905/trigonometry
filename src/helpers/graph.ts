import { useGraphDimensions } from "@/stores/graphDimensions";
import { pythagorean } from "./math";

const pointsToSlope = (start: {x: number, y: number}, end: {x: number, y: number}) => {
  const slope = (end.y - start.y) / (end.x - start.x);
  let yIntercept = -1 * ((slope * start.x) - start.y);
  // y-intercept is never defined when slope is infinity. Here I changed it to
  // mean x-intercept.
  if (Math.abs(slope) === Infinity) {
    yIntercept = start.x; 
  }

  const direction: 'left' | 'right' = end.x > start.x ? 'right' : 'left'

  return {slope, yIntercept, direction};
}

const pointsDistance = (start: {x: number, y: number}, end: {x: number, y: number}) => {
  return pythagorean(start.x - end.x, start.y - end.y);
}

const pointsAngle = (start: {x: number, y: number}, end: {x: number, y: number}) => {
  return Math.atan2(start.y - end.y, start.x - end.x);
}

const pointsTransform = (start: {x: number, y: number}, transform: {x: number, y: number}) => {
  return {x: start.x + transform.x, y: start.y + transform.y};
}

const invertSlopeOnPoint = ({slope, direction}: {slope: number, yIntercept: number, direction: 'left' | 'right'}, inversionPoint: {x: number, y: number}) => {
  const inverseSlope = -1 / slope;
  let inverseYIntercept = -1 * ((inverseSlope * inversionPoint.x) - inversionPoint.y);
  
  if (Math.abs(inverseSlope) === Infinity) {
    inverseYIntercept = inversionPoint.x; 
  }

  const inverseDirection: 'right' | 'left' = direction === 'left' ? 'right' : 'left';

  return {slope: inverseSlope, yIntercept: inverseYIntercept, direction: inverseDirection};
}

const convertBoxToWalls = (
  {top, right, bottom, left}: {top: number, right: number, bottom: number, left: number},
): {from: {x: number, y: number}, to: {x: number, y: number}}[] => {
  return [
    {
      from: {x: left, y: top},
      to: {x: right, y: top},
    },
    {
      from: {x: right, y: top},
      to: {x: right, y: bottom},
    },
    {
      from: {x: right, y: bottom},
      to: {x: left, y: bottom},
    },
    {
      from: {x: left, y: bottom},
      to: {x: left, y: top},
    },
  ]
}

const getLineIntersection = (
  line1: {from: {x: number, y: number}, to: {x: number, y: number}},
  line2: {from: {x: number, y: number}, to: {x: number, y: number}},
) => {
  // Check if none of the lines are of length 0
  if ((line1.from.x === line1.to.x && line1.from.y === line1.to.y) || (line2.from.x === line2.to.x && line2.from.y === line2.to.y)) {
    return false
  }

  const denominator = ((line2.to.y - line2.from.y) * (line1.to.x - line1.from.x) - (line2.to.x - line2.from.x) * (line1.to.y - line1.from.y))

  // Lines are parallel
  if (denominator === 0) {
    return false
  }

  const ua = ((line2.to.x - line2.from.x) * (line1.from.y - line2.from.y) - (line2.to.y - line2.from.y) * (line1.from.x - line2.from.x)) / denominator
  const ub = ((line1.to.x - line1.from.x) * (line1.from.y - line2.from.y) - (line1.to.y - line1.from.y) * (line1.from.x - line2.from.x)) / denominator

  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return false
  }

  // Return a object with the x and y coordinates of the intersection
  const x = line1.from.x + ua * (line1.to.x - line1.from.x)
  const y = line1.from.y + ua * (line1.to.y - line1.from.y)

  return {x, y}
}

const rayTraceToWall = (
  {slope, direction}: {slope: number, yIntercept: number, direction: 'left' | 'right'},
  startingPoint: {x: number, y: number},
  walls: {from: {x: number, y: number}, to: {x: number, y: number}}[],
) => {
  let minimumDistance = Infinity;
  let minimumDistanceIntersection = {x: 0, y: 0};
  
  for (const wall of walls) {
    // We will get angle of the path
    let angle = Math.atan2(slope, 1);
    if (Math.abs(slope) === Infinity) {
      angle = -angle;
    }
    if (direction === 'right') angle += Math.PI;
    const deviatedPoint = {
      x: Math.cos(angle) * 10000,
      y: Math.sin(angle) * 10000,
    }
    const intersectionPoint = getLineIntersection(wall, {from: startingPoint, to: deviatedPoint})
    if (intersectionPoint) {
      const currentDistance = pointsDistance(startingPoint, intersectionPoint);
      if (minimumDistance > currentDistance) {
        minimumDistanceIntersection = intersectionPoint;
        minimumDistance = currentDistance
      }
    }
  }

  return minimumDistanceIntersection;
}

/**
 * Map the cartesian coordinates to pixels on the svg
 */
const mapToGraph = (coordinates: {x: number, y: number}, axis: 'x' | 'y' | 'both' = 'both') => {
  const graphDimensionsStore = useGraphDimensions();

  if (isNaN(coordinates?.x) || isNaN(coordinates?.y)) return '0,0';
  const scaled = {x: coordinates.x * 25, y: coordinates.y * 25}
  const centered = {
    x: scaled.x + (graphDimensionsStore.dimensions.width * 0.5),
    y: -scaled.y + (graphDimensionsStore.dimensions.height * 0.5),
  }
  if (axis === 'both') return `${centered.x},${centered.y}`;
  else if (axis === 'y') return `${centered.y}`;
  else if (axis === 'x') return `${centered.x}`;
}

const pointIntersectionOnAxis = (center: {x: number, y: number}, rotation: number, point: {x: number, y: number}) => {
  const axisDistance = pointsDistance(center, point);
  // Create a line perpendicular to the x-axis
  const axisLineFrom = {
    x: Math.cos(rotation) * axisDistance + center.x,
    y: Math.sin(rotation) * axisDistance + center.y,
  };
  const axisLineTo = {
    x: Math.cos(rotation + Math.PI) * axisDistance + center.x,
    y: Math.sin(rotation + Math.PI) * axisDistance + center.y,
  };
  // Create a line perpendicular to the x-axis from the angle point
  const angleLineFrom = {
    x: Math.cos(rotation + Math.PI / 2) * axisDistance + point.x,
    y: Math.sin(rotation + Math.PI / 2) * axisDistance + point.y,
  };
  const angleLineTo = {
    x: Math.cos(rotation + Math.PI * 3 / 2) * axisDistance + point.x,
    y: Math.sin(rotation + Math.PI * 3 / 2) * axisDistance + point.y,
  };
  return getLineIntersection({from: axisLineFrom, to: axisLineTo}, {from: angleLineFrom, to: angleLineTo});
}

const rectanglesIntersect = (
  a: {top: number, right: number, bottom: number, left: number},
  b: {top: number, right: number, bottom: number, left: number},
) => {
  const aLeftOfB = a.right < b.left;
  const aRightOfB = a.left > b.right;
  const aAboveB = a.bottom > b.top;
  const aBelowB = a.top < b.bottom;

  return !( aLeftOfB || aRightOfB || aAboveB || aBelowB );
}

export { pointsToSlope, pointsDistance, pointsAngle, convertBoxToWalls, pointsTransform, rayTraceToWall, invertSlopeOnPoint, mapToGraph, getLineIntersection, pointIntersectionOnAxis, rectanglesIntersect };