const pythagorean = (a: number, b: number) => {
  return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}

const radiansToDegrees = (radians: number) => {
  return radians * 180 / Math.PI;
}

const roundNumbers = (num: number, round: number = 0) => {
  const multiplier = 10 ** round;
  return Math.round((num + Number.EPSILON) * multiplier) / multiplier;
}

const clamp = (num: number, min: number, max: number) => {
  return Math.min(Math.max(num, min), max)
}

export { pythagorean, radiansToDegrees, roundNumbers, clamp };