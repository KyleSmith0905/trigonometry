<script setup lang="ts">
  import { firestore } from '@/helpers/firebase';
  import { collection, doc } from 'firebase/firestore';
  import { computed } from 'vue';
  import { useCurrentUser, useDocument } from 'vuefire';
  
  const user = useCurrentUser();
  const userDocument = computed(() => {
    const userId = user.value?.uid;
    if (!userId) return;
    const document = useDocument(doc(collection(firestore, 'users'), `${userId}`));
    return document;
  })
</script>

<template>
  <div class="flex flex-col items-center">
    <h1 class="subheader">Payment Success</h1>
    <p class="paragraph mt-2 w-11/12 text-center">
      Congratulations! You have purchased Trigonometry Simulator Premium. Thank you for your support.
    </p>
    <p class="paragraph mt-4 w-11/12 text-center">
      If you have any questions, please ask on <a href="https://discord.gg/dJKUYq5qEn">Discord</a>.
    </p>
    <template v-if="!userDocument?.data.value || userDocument.data.value?.membership !== 'premium'">
      <p class="paragraph mt-4 w-11/12 text-center">
        We are doing last minute checks, one second please. Feel free to close out.
      </p>
      <LoadingSpinner class="mt-2"/>
    </template>
    <p v-else class="paragraph mt-4 w-11/12 text-center">
      We have confirmed your purchase. Enjoy!
    </p>
  </div>
</template>