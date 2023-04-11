<script setup lang="ts">
  import { mapToGraph, rectanglesIntersect } from '@/helpers/graph';
  import { useGraphDimensions } from '@/stores/graphDimensions';
  import { useGraphText } from '@/stores/graphText';
  import { getCurrentInstance, ref, watch } from 'vue';

  const textRef = ref<SVGTextElement | null>(null);
  const simulationRef = ref<SVGTextElement | null>(null);
  const adjustedPosition = ref<{x: number, y: number}>({x: 0, y: 0});
  const size = ref<{width: number, height: number}>({width: 0, height: 0});
  const graphDimensionsStore = useGraphDimensions();
  const graphTextStore = useGraphText();
  const instance = getCurrentInstance();

  const props = defineProps<{
    position: {x: number, y: number},
    alignX: 'left' | 'right',
    alignY: 'top' | 'bottom',
    text: string,
    color?: string,
  }>();

  const textUpdated = () => {
    const textBoundsClient = simulationRef.value?.getBoundingClientRect();
    if (!textBoundsClient) return;

    const bounds = graphDimensionsStore.boundingBox;
    const dimensions = graphDimensionsStore.dimensions;

    const textBounds = {
      left: (textBoundsClient.left - (dimensions.width * 0.5) - dimensions.left) / 25,
      right: (textBoundsClient.right - (dimensions.width * 0.5) - dimensions.left) / 25,
      top: (textBoundsClient.top - (dimensions.height * 0.5)) / 25,
      bottom: (textBoundsClient.bottom - (dimensions.height * 0.5)) / 25
    }

    size.value = {
      width: textBoundsClient.width / 25,
      height: textBoundsClient.height / 25,
    }

    if (!textBounds) return;

    adjustedPosition.value = {
      x: props.position.x,
      y: props.position.y,
    }

    if (textBounds.left < bounds.left) {
      adjustedPosition.value.x -= textBounds.left - bounds.left - 1;
    };
    if (textBounds.right > bounds.right) {
      adjustedPosition.value.x -= textBounds.right - bounds.right + 1;
    };
    if (textBounds.top < bounds.top) {
      adjustedPosition.value.y += textBounds.top - bounds.top - 1;
    };
    if (textBounds.bottom > bounds.bottom) {
      adjustedPosition.value.y += textBounds.bottom - bounds.bottom + 1;
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
      right: textBounds.left + size.value.width - props.position.x + adjustedPosition.value.x,
      top: -(textBounds.top + props.position.y - adjustedPosition.value.y),
      bottom: -(textBounds.top + size.value.height + props.position.y - adjustedPosition.value.y),
    };

    const attemptFindPosition = (multiply = 0.5, inverse = false) => {
      let newYPosition = adjustedPosition.value.y - multiply;
      if (inverse) {
        newYPosition = adjustedPosition.value.y + multiply;
      }

      const tempAdjustedTextBounds = {
        left: textBounds.left - props.position.x + adjustedPosition.value.x,
        right: textBounds.left + size.value.width - props.position.x + adjustedPosition.value.x,
        top: -(textBounds.top + props.position.y - newYPosition),
        bottom: -(textBounds.top + size.value.height + props.position.y - newYPosition),
      }

      const isValidLocation = textElement.every((compareElement) => {
        const compareBounds = graphTextStore.getTextBounds(compareElement);
        if (!compareBounds) return true;

        const doesIntersect = rectanglesIntersect(tempAdjustedTextBounds, compareBounds);
        
        if (doesIntersect) return false;
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
      const result = attemptFindPosition(Math.floor((i / 2) + 1) / 4, (i % 2) === 1);
      if (result === true) break;
    }
    
    if (instance?.uid) {
      graphTextStore.setTextBounds(instance.uid, adjustedTextBounds);
    }
    textRef.value?.setAttribute('data-text-evaluation', 'true');
  }

  watch([props], () => textUpdated());
  setTimeout(() => textUpdated());
</script>

<template>
  <text
    :x="mapToGraph(position, 'x')"
    :y="mapToGraph(position, 'y')"
    :dx="alignX === 'left' ? 20 : -20"
    :dy="alignY === 'top' ? 20 : -20"
    :text-anchor="alignX === 'left' ? 'start' : 'end'"
    :dominant-baseline="alignY ? 'hanging' : 'text-top'"
    ref="simulationRef"
    class="graph-text fill-transparent"
  >
    {{ text }}
  </text>
  <text
    :x="mapToGraph(adjustedPosition, 'x')"
    :y="mapToGraph(adjustedPosition, 'y')"
    :dx="(alignX === 'left' ? 20 : -20)"
    :dy="(alignY === 'top' ? 20 : -20)"
    :text-anchor="alignX === 'left' ? 'start' : 'end'"
    :dominant-baseline="alignY ? 'hanging' : 'text-top'"
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