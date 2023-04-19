import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { convertBoxToWalls } from '@/helpers/graph';

export const useGraphDimensions = defineStore('graphDimensions', () => {
  const dimensions = ref({width: innerWidth, height: innerHeight, left: 0, top: 0, bottom: 0, right: 0});
  
  const boundingBox = computed(() => {
    return {
      top: dimensions.value.height * -0.02,
      left: dimensions.value.width * -0.02,
      bottom: dimensions.value.height * 0.02,
      right: dimensions.value.width * 0.02,
    };
  })

  // I'm modifying it a little so the walls extend outwards in case a slope starts from outside the graph
  const walls = computed(() => {
    const walls = convertBoxToWalls(boundingBox.value);
    walls[0].from.x *= 2;
    walls[0].to.x *= 2;
    walls[1].from.y *= 2;
    walls[1].to.y *= 2;
    walls[2].from.x *= 2;
    walls[2].to.x *= 2;
    walls[3].from.y *= 2;
    walls[3].to.y *= 2;

    return walls
  })

  const updateDimensions = ({width, height, left, top, right, bottom}: DOMRectReadOnly) => {
    // Glitches arrive when width or height is 0. Usually when the settings menu is open.
    if (width < 0.1 || height < 0.1) return;
    dimensions.value = {
      width: width,
      height: height,
      left: left,
      top: top,
      right: right,
      bottom: bottom,
    }
  }

  return {dimensions, boundingBox, walls, updateDimensions};
})
