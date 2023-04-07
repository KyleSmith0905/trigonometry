<script setup lang="ts">
  import { mapToGraph } from '@/helpers/graph';

  defineProps<{
    position: {x: number, y: number},
    alignX: 'left' | 'right',
    alignY: 'top' | 'bottom',
    text: string,
  }>();
</script>

<template>
  <text
    :x="mapToGraph(position, 'x')"
    :y="mapToGraph(position, 'y')"
    :dx="alignX === 'left' ? 20 : -20"
    :dy="alignY === 'top' ? 20 : -20"
    :text-anchor="alignX === 'left' ? 'start' : 'end'"
    :dominant-baseline="alignY ? 'hanging' : 'text-top'"
    stroke-linecap='square'
    class="graph-text"
  >{{ text }}</text>
</template>