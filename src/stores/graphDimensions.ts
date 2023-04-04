import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { convertBoxToWalls } from '@/helpers/graph';

export const useGraphDimensions = defineStore('graphDimensions', () => {
  const dimensions = ref({width: innerWidth, height: innerHeight, left: 0, top: 0});
  
  const boundingBox = computed(() => {
    return {
      top: dimensions.value.height * -0.02,
      left: dimensions.value.width * -0.02,
      bottom: dimensions.value.height * 0.02,
      right: dimensions.value.width * 0.02,
    };
  })

  const walls = computed(() => {
    return convertBoxToWalls(boundingBox.value);
  })

  const updateDimensions = ({width, height, left, top}: DOMRectReadOnly) => {
    dimensions.value = {
      width: width,
      height: height,
      left: left,
      top: top,
    }
  }

  return {dimensions, boundingBox, walls, updateDimensions};
})
