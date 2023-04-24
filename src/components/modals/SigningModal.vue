<script setup lang="ts">
  import { ref } from 'vue';
  import TextInput from '../formElements/TextInput.vue';
  import { createUserWithEmailAndPassword, signInWithEmailAndPassword, type AuthError } from 'firebase/auth';
  import { auth, mapAuthCodeToMessage } from '@/helpers/firebase';
  import { useModalGenerator } from '@/stores/modalGenerator';
  import ActionButton from '../formElements/ActionButton.vue';

  const email = ref('');
  const password = ref('');
  const error = ref('');

  const modalGeneratorStore = useModalGenerator();

  const logIn = async () => {
    error.value = '';
    const logInResults = await signInWithEmailAndPassword(auth, email.value, password.value).catch((createAccountResults: AuthError) => {
      const errorMessage = mapAuthCodeToMessage(createAccountResults.code);
      error.value = errorMessage;
      return 'error';
    });
    if (logInResults === 'error') return;
    
    modalGeneratorStore.escapeModal();
    modalGeneratorStore.openModal('payment');
  }
  
  const createAccount = async () => {
    error.value = '';
    const createAccountResults = await createUserWithEmailAndPassword(auth, email.value, password.value).catch((createAccountResults: AuthError) => {
      const errorMessage = mapAuthCodeToMessage(createAccountResults.code);
      error.value = errorMessage;
      return 'error';
    });
    if (createAccountResults === 'error') return;

    modalGeneratorStore.escapeModal();
    modalGeneratorStore.openModal('payment');
  }
</script>

<template>
  <div class="flex flex-col items-center">
    <h1 class="subheader">Login or Register</h1>
    <img class="mt-4" width="64" src="/images/logo.svg"/>
    <TextInput class="mt-10" label="Email" type="email" @change="email = $event"/>
    <TextInput class="mt-3" label="Password" type="password" @change="password = $event"/>
    <div class="mt-6 flex flex-row gap-2">
      <ActionButton @click="logIn()" text="Sign In"/>
      <ActionButton @click="createAccount()" text="Create Account"/>
    </div>
    <p class="paragraph mt-3 text-red-600 w-3/4 text-center">{{ error }}</p>
  </div>
</template>

<style scoped>
</style>