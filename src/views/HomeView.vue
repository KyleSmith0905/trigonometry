<script setup lang="ts">
  import GridBackground from '@/components/GridBackground.vue';
  import DraggablePoints from '@/components/DraggablePoints.vue';
  import GraphLines from '@/components/GraphLines.vue';
  import { useGraphDimensions } from '@/stores/graphDimensions';
  import { useEventListener, useResizeObserver } from '@vueuse/core';
  import { ref } from 'vue';
  import { useDraggablePoints } from '@/stores/draggablePoints';
  
  const graphDimensionsStore = useGraphDimensions();
  const draggablePointsStore = useDraggablePoints();
  const graphContainerRef = ref<HTMLDivElement | null>(null);
  const scrollContainerRef = ref<HTMLDivElement | null>(null);

  useResizeObserver(graphContainerRef, (entries) => {
    graphDimensionsStore.updateDimensions(
      graphContainerRef.value?.getBoundingClientRect() ?? entries[0].contentRect
    );
  });
  
  useEventListener(scrollContainerRef, 'scroll', () => {
    const dimensions = graphContainerRef.value?.getBoundingClientRect();
    if (dimensions) {
      graphDimensionsStore.updateDimensions(dimensions);
    };
  });
  
  draggablePointsStore.setPoint('main', {x: 0, y: -2});
  draggablePointsStore.setPoint('axis', {x: 5, y: -2});
  draggablePointsStore.setPoint('angle', {x: 5, y: 2});
</script>

<template>
  <div class="divide-y divide-slate-200 h-screen overflow-y-auto" ref="scrollContainerRef">
    <div class="bg-slate-100 h-80 relative">
      <div class="h-full" ref="graphContainerRef">
        <GridBackground/>
        <GraphLines/>
        <DraggablePoints/>
      </div>
      <div class="absolute flex items-center justify-center top-0 h-full w-full pointer-events-none">
        <h2 class="px-3 py-2 rounded-md text-slate-700 font-bold font-mono text-2xl bg-slate-200 bg-opacity-90 backdrop-blur-sm drop-shadow-lg">Trigonometry Simulator</h2>
      </div>
    </div>
    <div class="bg-slate-50 py-4">
      <div class="max-w-4xl w-10/12 mx-auto">
        <h2 class="text-lg font-bold font-mono text-slate-700">Sign In</h2>
        <p class="text-slate-800">Explore the power of trigonometric functions with our easy-to-use interface. See how these functions build the bridge between cartesian coordinates and polar coordinates.</p>
        <div class="h-4"></div>
        <button class="block px-4 py-2 mx-auto bg-slate-200 hover:bg-slate-300 transition-colors">Sign In</button>
      </div>
    </div>
    <div class="bg-slate-100 py-4">
      <div class="flex flex-wrap sm:flex-nowrap gap-6 max-w-4xl w-10/12 mx-auto">
        <div class="h-fit my-auto">
          <h2 class="text-lg font-bold font-mono text-slate-700">Easy To Use</h2>
          <p class="text-slate-800">Explore the power of trigonometric functions with our easy-to-use interface. See how these functions build the bridge between cartesian coordinates and polar coordinates.</p>
        </div>
        <div class="flex items-center">
          <img class="rounded-md shadow-md" src="/images/screenshot-simple.png"/>
        </div>
      </div>
    </div>
    <div class="bg-slate-50 py-4">
      <div class="flex flex-wrap sm:flex-nowrap gap-6 max-w-4xl w-10/12 mx-auto">
        <div class="flex items-center">
          <img class="rounded-md shadow-md" src="/images/screenshot-complex.png"/>
        </div>
        <div class="h-fit my-auto">
          <h2 class="text-lg font-bold font-mono text-slate-700">Unlimited Customization</h2>
          <p class="text-slate-800">Optionally simulate sine, secant, tangent, cosine, cosecant, and cotangent. Generate an understanding on how these functions were derived.</p>
        </div>
      </div>
    </div>
    <div class="bg-slate-100 py-4">
      <div class="max-w-4xl w-10/12 mx-auto">
        <p class="text-center text-slate-700">
          Developed By
          <a target="_blank" href="https://yskkyle.com" class="text-slate-500 font-mono">Kyle Smith</a>
          At
          <a target="_blank" href="https://sparrow-design.com" class="text-slate-500 font-mono">Sparrow Design</a>
        </p>
        <div class="h-4"></div>
        <div class="grid grid-cols-2 text-center">
          <div>
            <a target="_blank" href="https://discord.gg/dJKUYq5qEn">Support And Feedback</a>
            <p>Hello World</p>
            <p>Hello World</p>
          </div>
          <div>
            <a target="_blank" href="https://discord.gg/dJKUYq5qEn">Privacy Policy</a>
            <p>Hello World</p>
            <p>Hello World</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
</style>