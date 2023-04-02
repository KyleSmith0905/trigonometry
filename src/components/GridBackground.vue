<script setup lang="ts">
</script>

<template>
  <div class="absolute w-full h-full background-dots"></div>
</template>

<style scoped>
  .background-dots {
    background-image: radial-gradient(theme('colors.slate.400') 1px, theme('colors.slate.100') 1px);
    background-size: 25px 25px;
    background-position: center;
  }
</style>
