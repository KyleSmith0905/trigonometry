<script setup lang="ts">
  import { VueSpinnerGrid } from 'vue3-spinners';
  import { useUserData } from '@/stores/userData';
  import { watch } from 'vue';

  const userDataStore = useUserData();

  watch([userDataStore], () => {
    const hasPremium = userDataStore.userData?.data?.membership !== 'premium';
    if (hasPremium) {
      history.replaceState({}, '', `${location.protocol + "//" + location.host}/graph`);
    }
  })
</script>

<template>
  <div class="flex flex-col items-center">
    <h1 class="subheader">Payment Success</h1>
    <p class="paragraph mt-2 w-11/12 text-center">
      Congratulations! You have purchased Trigonometry Simulator Premium. Thank you for your support.
    </p>
    <p class="paragraph mt-4 w-11/12 text-center">
      If you have any questions, please ask on our <a class="text-slate-500" href="https://discord.gg/dJKUYq5qEn">Discord</a>.
    </p>
    <template v-if="!userDataStore.userData?.data || userDataStore.userData.data?.membership !== 'premium'">
      <p class="paragraph mt-4 w-11/12 text-center">
        We are doing last minute checks, one second please. Feel free to close out.
      </p>
      <VueSpinnerGrid class="mt-5 w-12 h-12" color="theme('colors.slate.800')"/>
    </template>
    <p v-else class="paragraph mt-4 w-11/12 text-center">
      We have confirmed your purchase. Enjoy!
    </p>
  </div>
</template>