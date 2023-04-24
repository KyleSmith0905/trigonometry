<script setup lang="ts">
  import { useModalGenerator } from '@/stores/modalGenerator';
  import SigningModal from './SigningModal.vue';
  import PaymentModal from './PaymentModal.vue';
  import PaymentSuccessModal from './PaymentSuccessModal.vue';
  import { ref } from 'vue';

  const modalGeneratorStore = useModalGenerator();
  const props = defineProps<{
    content: string
  }>();
  const cancelPropagation = ($event: MouseEvent) => {
    $event.stopPropagation();
  }

  const containerRef = ref<HTMLDivElement>();
</script>

<template>
  <div @click="modalGeneratorStore.escapeModal()" ref="containerRef" class="fade-in flex items-center justify-center absolute z-50 w-full h-full bg-slate-500 bg-opacity-20">
    <div @click="cancelPropagation($event)" class="jump-in relative max-w-lg max-h-screen w-3/4 h-4/5 p-2 bg-slate-50 rounded-lg shadow-2xl shadow-slate-400 ring-2 ring-slate-200 overflow-y-auto">
      <button
        @click="modalGeneratorStore.escapeModal()"
        class="absolute text-4xl top-2 right-2 rounded-full text-slate-800 hover:bg-slate-300 transition-colors"
      >
        <ion-icon class="block" name="close-circle-outline"></ion-icon>
      </button>
      <SigningModal v-if="props.content === 'signing'"/>
      <PaymentModal v-if="props.content === 'payment'"/>
      <PaymentSuccessModal v-if="props.content === 'payment-success'"/>
    </div>
  </div>
</template>

<style scoped>
  .fade-in {
    animation-name: opacity-in;
    animation-duration: 150ms;
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }

  .jump-in {
    animation-name: transform-up;
    animation-duration: 150ms;
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes opacity-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes transform-up {
    0% {
      transform: translateY(5rem);
    }
    100% {
      transform: translateY(0rem);
    }
  }
</style>