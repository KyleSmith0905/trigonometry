import { useFunctionsSettings, type FunctionData } from "@/stores/functionsSettings";
import { radiansToDegrees, roundNumbers } from "./math";
import { useDraggablePoints } from "@/stores/draggablePoints";

const trimTemplateLiterals = (templateLiteral: string) => {
  return templateLiteral.split("\n")
  .map(s => s.trim())
  // Remove empty lines by filtering them out
  .filter(Boolean)
  .join("\n")
}

const writeEquation = (functionData: FunctionData, conversion: (angle: number) => number) => {
  const {includeScale} = useFunctionsSettings();
  const {unitScale, angle} = useDraggablePoints();
  
  // Writes the equation into 
  let equation = `${functionData.id}(${roundNumbers(radiansToDegrees(angle))}°)`;
  let answer = conversion(angle);
  if (includeScale) {
    equation = equation + ` * ${roundNumbers(unitScale, 1)}`;
    answer = answer * unitScale;
  }
  const stringifiedAnswer = `${roundNumbers(answer, 1)}`;
  
  let value = ''
  if (functionData.equation === 'none') value = '';
  else if (functionData.equation === 'answer') value = stringifiedAnswer;
  else if (functionData.equation === 'equation') value = equation;
  else if (functionData.equation === 'full') value = [equation, stringifiedAnswer].join(' = ');

  return value;
}

export { trimTemplateLiterals, writeEquation };