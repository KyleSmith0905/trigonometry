import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useGraphText = defineStore('graphText', () => {
  const graphBounds = ref<{elementUid: number, bounds: {left: number, right: number, top: number, bottom: number}}[]>([]);

  const getTextBounds = (element: Element) => {
    const elementUid = parseFloat(element.id.split('-text')[0]);
    return graphBounds.value.find(e => e.elementUid === elementUid)?.bounds;
  }

  const setTextBounds = (elementUid: number, bounds: {left: number, right: number, top: number, bottom: number}) => {
    const position = graphBounds.value.find(e => e.elementUid === elementUid);
    if (position) {
      position.bounds = bounds;
    }
    else {
      graphBounds.value = [...graphBounds.value, {elementUid: elementUid, bounds: bounds}];
    }
  }

  return {graphBounds, getTextBounds, setTextBounds};
})
