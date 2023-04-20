<script setup lang="ts">
  import { mapToGraph, rectanglesIntersect } from '@/helpers/graph';
  import { xor } from '@/helpers/logic';
  import { sleep } from '@/helpers/time';
  import { useGraphDimensions } from '@/stores/graphDimensions';
  import { useGraphText } from '@/stores/graphText';
  import { useSettingsMenu } from '@/stores/settingsMenu';
  import { getCurrentInstance, ref, watch } from 'vue';

  const textRef = ref<SVGTextElement | null>(null);
  const simulationRef = ref<SVGTextElement | null>(null);
  const adjustedPosition = ref<{x: number, y: number}>({x: 0, y: 0});
  const startSize = ref<{width: number, height: number}>({width: 0, height: 0});
  const startTextBounds = ref<Record<'top' | 'bottom' | 'left' | 'right', number> | undefined>();
  const startPosition = ref<{x: number, y: number}>({x: 0, y: 0});
  const startAlign = ref<{x: 'left' | 'right', y: 'top' | 'bottom'} | undefined>(undefined);
  const graphDimensionsStore = useGraphDimensions();
  const graphTextStore = useGraphText();
  const instance = getCurrentInstance();
  const settingsMenuStore = useSettingsMenu();

  const props = defineProps<{
    position: {x: number, y: number},
    alignX: 'left' | 'right',
    alignY: 'top' | 'bottom',
    text: string,
    color?: string,
  }>();

  const textUpdated = async (forceUpdate = false) => {
    // Save boundingClientRect calls so it doesn't need to be sent every frame.
    if (!startAlign.value || forceUpdate) {
      // If alignment hasn't changed yet, don't update the new text position yet.
      if (
        xor(simulationRef.value?.getAttribute('text-anchor') === 'start', props.alignX === 'left') ||
        xor(simulationRef.value?.getAttribute('dominant-baseline') === 'hanging', props.alignY === 'top')
      ) {
        await sleep();
        textUpdated(forceUpdate);
        return;
      };

      const textBoundingClient = simulationRef.value?.getBoundingClientRect();
      
      if (!textBoundingClient || textBoundingClient.width <= 0) return;
      
      const dimensions = graphDimensionsStore.dimensions;

      // Keep data through loops of text updating to make code faster
      startTextBounds.value = {
        left: (textBoundingClient.left - (dimensions.width * 0.5) - dimensions.left) / 25,
        right: (textBoundingClient.right - (dimensions.width * 0.5) - dimensions.left) / 25,
        top: (textBoundingClient.top - (dimensions.height * 0.5)) / 25,
        bottom: (textBoundingClient.bottom - (dimensions.height * 0.5)) / 25,
      }
      startSize.value = {
        width: textBoundingClient.width / 25,
        height: textBoundingClient.height / 25,
      }
      startPosition.value = {
        x: (parseFloat(simulationRef.value?.getAttribute('x') ?? '0') - (dimensions.width * 0.5) + dimensions.left) / 25,
        y: (parseFloat(simulationRef.value?.getAttribute('y') ?? '0') - (dimensions.height * 0.5) + dimensions.top) / -25,
      };
      startAlign.value = {x: props.alignX, y: props.alignY};
    }
    // Declares that the alignment will be changed next iteration
    if (startAlign.value && (startAlign.value.x !== props.alignX || startAlign.value.y !== props.alignY)) {
      startAlign.value = undefined;
    }
    if (!startTextBounds.value) return;

    const bounds = graphDimensionsStore.boundingBox;
    
    const boundingClientRectDifferences = {
      x: startPosition.value.x - props.position.x,
      y: startPosition.value.y - props.position.y,
    }

    // Gets the current text bounds by interpolating start bounds and the difference.
    const textBounds = {
      left: startTextBounds.value.left - boundingClientRectDifferences.x,
      right: startTextBounds.value.right - boundingClientRectDifferences.x,
      top: -(startTextBounds.value.top + boundingClientRectDifferences.y),
      bottom: -(startTextBounds.value.bottom + boundingClientRectDifferences.y),
    }
    
    adjustedPosition.value = {
      x: props.position.x,
      y: props.position.y,
    }
    
    if (textBounds.left < bounds.left + 1.5) {
      adjustedPosition.value.x -= textBounds.left - bounds.left - 1.5;
    };
    if (textBounds.right > bounds.right - 1.5) {
      adjustedPosition.value.x -= textBounds.right - bounds.right + 1.5;
    };
    if (textBounds.top < bounds.top + 1.5) {
      adjustedPosition.value.y -= textBounds.top - bounds.top - 1.5;
    };
    if (textBounds.bottom > bounds.bottom - 1.5) {
      adjustedPosition.value.y -= textBounds.bottom - bounds.bottom + 1.5;
    };

    // Ensure already checked elements are not rechecking
    const unfilteredTextElement = [...document.querySelectorAll('*[data-element-group="text"]')];
    let textElement = unfilteredTextElement.filter((element) => element.getAttribute('data-text-evaluation') === 'true')
    if (textElement.length === unfilteredTextElement.length) {
      unfilteredTextElement.forEach((element) => element.setAttribute('data-text-evaluation', 'false'));
      textElement = [];
    }

    let adjustedTextBounds = {
      left: textBounds.left - props.position.x + adjustedPosition.value.x,
      right: textBounds.left + startSize.value.width - props.position.x + adjustedPosition.value.x,
      top: textBounds.top - props.position.y + adjustedPosition.value.y,
      bottom: textBounds.top - startSize.value.height - props.position.y + adjustedPosition.value.y,
    };

    const isOutOfBounds = (newTextBounds: typeof adjustedTextBounds) => {
      return (
        newTextBounds.left < bounds.left ||
        newTextBounds.right > bounds.right ||
        newTextBounds.top < bounds.top ||
        newTextBounds.bottom > bounds.bottom
      );
    }

    // Offsets the element slightly and check if the position is available.
    const attemptFindPosition = (multiply = 0.6, inverse = false) => {
      let newYPosition = adjustedPosition.value.y - multiply;
      if (inverse) {
        newYPosition = adjustedPosition.value.y + multiply;
      }

      const tempAdjustedTextBounds = {
        left: textBounds.left - props.position.x + adjustedPosition.value.x,
        right: textBounds.left + startSize.value.width - props.position.x + adjustedPosition.value.x,
        top: textBounds.top - props.position.y + newYPosition,
        bottom: textBounds.top - startSize.value.height - props.position.y + newYPosition,
      }

      const isValidLocation = textElement.every((compareElement) => {
        const compareBounds = graphTextStore.getTextBounds(compareElement);
        if (!compareBounds) return true;

        
        const doesIntersect = rectanglesIntersect(tempAdjustedTextBounds, compareBounds);
        const doesOutOfBounds = isOutOfBounds(tempAdjustedTextBounds);
        
        if (doesIntersect || doesOutOfBounds) return false;
        else return true;
      });
      
      if (isValidLocation) {
        adjustedTextBounds = tempAdjustedTextBounds;
        adjustedPosition.value.y = newYPosition;
        return true;
      }
      else {
        return false;
      }
    }

    for (let i = -1; i < 30; i++) {
      const result = attemptFindPosition(Math.floor((i / 2) + 1) / 3, (i % 2) === 1);
      if (result === true) break;
    }
    
    if (instance?.uid) {
      graphTextStore.setTextBounds(instance.uid, adjustedTextBounds);
    }
    textRef.value?.setAttribute('data-text-evaluation', 'true');
  }

  watch([props], () => textUpdated());
  setTimeout(() => textUpdated());
  // Performs a final sweep to update everything properly after the menu is closed
  settingsMenuStore.$subscribe(() => setTimeout(() => textUpdated(true), 200));
</script>

<template>
  <text
    v-if="text"
    :x="mapToGraph(position, 'x')"
    :y="mapToGraph(position, 'y')"
    :dx="alignX === 'left' ? 20 : -20"
    :dy="alignY === 'top' ? 20 : -20"
    :text-anchor="alignX === 'left' ? 'start' : 'end'"
    :dominant-baseline="alignY === 'top' ? 'hanging' : 'text-top'"
    ref="simulationRef"
    class="graph-text fill-transparent"
  >
    {{ text }}
  </text>
  <text
    v-if="text"
    :x="mapToGraph(adjustedPosition, 'x')"
    :y="mapToGraph(adjustedPosition, 'y')"
    :dx="(alignX === 'left' ? 20 : -20)"
    :dy="(alignY === 'top' ? 20 : -20)"
    :text-anchor="alignX === 'left' ? 'start' : 'end'"
    :dominant-baseline="alignY === 'top' ? 'hanging' : 'text-top'"
    :id="instance?.uid + '-text'"
    :fill="props.color ?? '#0f172a'"
    ref="textRef"
    stroke-linecap='square'
    class="graph-text"
    data-element-group="text"
    data-text-evaluation="false"
  >
    {{ text }}
  </text>
</template>