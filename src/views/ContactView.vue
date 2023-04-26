<script setup lang="ts">
  import TheContainer from '@/components/TheContainer.vue';
</script>

<template>
  <TheContainer>
    <div class="bg-slate-100 py-4">
      <div class="max-w-4xl w-10/12 mx-auto">
        <h2 class="font-mono text-2xl font-bold text-center text-slate-700">Contact Us</h2>
      </div>
    </div>
    <div class="bg-slate-50 py-4">
      <h2 class="font-mono text-lg font-bold text-center text-slate-700">Discord</h2>
      <div class="flex flex-wrap sm:flex-nowrap gap-6 max-w-4xl w-10/12 mx-auto">
        <div class="h-fit my-auto">
          <p class="text-slate-800">Reach out to the Trigonometry Simulator community for advice and support. Our Discord server is the perfect place to suggest new features or report bugs.</p>
          <p class="text-slate-800 mt-2">We are always looking for ways to improve the Trigonometry Simulator, and we appreciate your feedback. Join our Discord server today and let us know what you think!</p>
        </div>
        <div class="flex items-center gap-2">
          <a class="whitespace-nowrap text-lg text-slate-800" href="https://discord.gg/dJKUYq5qEn">dJKUYq5qEn</a>
          <ion-icon class="text-2xl text-slate-800" name='logo-discord'></ion-icon>
        </div>
      </div>
    </div>
    <div class="bg-slate-100 py-4">
      <h2 class="font-mono text-lg font-bold text-center text-slate-700">Email</h2>
      <div class="flex flex-wrap sm:flex-nowrap gap-6 max-w-4xl w-10/12 mx-auto">
        <div class="h-fit my-auto">
          <p class="text-slate-800">If you would prefer to reach out to us directly, you can also email us at my personal email. I am happy to help you with any questions or concerns you may have.</p>
        </div>
        <div class="flex items-center gap-2">
          <a class="whitespace-nowrap text-lg text-slate-800" href="mailto:me@yskkyle.com">me@yskkyle.com</a>
          <ion-icon class="text-2xl text-slate-800" name='mail'></ion-icon>
        </div>
      </div>
    </div>
  </TheContainer>
</template>