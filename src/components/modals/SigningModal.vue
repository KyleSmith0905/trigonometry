<script setup lang="ts">
  import { ref } from 'vue';
  import TextInput from '../formElements/TextInput.vue';
  import { createUserWithEmailAndPassword, signInWithEmailAndPassword, type AuthError, type UserCredential, sendPasswordResetEmail } from 'firebase/auth';
  import { auth, firestore, mapAuthCodeToMessage } from '@/helpers/firebase';
  import { useModalGenerator } from '@/stores/modalGenerator';
  import ActionButton from '../formElements/ActionButton.vue';
  import { collection, doc, getDoc } from 'firebase/firestore';

  const email = ref('');
  const password = ref('');
  const error = ref('');
  const response = ref('');
  const loading = ref<false | 'signIn' | 'createAccount' | 'forgetPassword'>(false);

  const modalGeneratorStore = useModalGenerator();

  const logIn = async () => {
    loading.value = 'signIn';
    response.value = '';
    error.value = '';
    const logInResults = await signInWithEmailAndPassword(auth, email.value, password.value).catch((createAccountResults: AuthError) => {
      const errorMessage = mapAuthCodeToMessage(createAccountResults.code);
      error.value = errorMessage;
      loading.value = false;
      return 'error';
    });
    if (logInResults === 'error') return;
    const user = (logInResults as UserCredential).user;

    const userDocument = await getDoc(doc(collection(firestore, 'users'), `${user.uid}`));
    const userData = userDocument.data();
    
    modalGeneratorStore.escapeModal();
    // Don't show payment if user already has premium
    if (userData?.membership !== 'premium') {
      modalGeneratorStore.openModal('payment');
    }
    loading.value = false;
  }
  
  const createAccount = async () => {
    loading.value = 'createAccount';
    response.value = '';
    error.value = '';
    const createAccountResults = await createUserWithEmailAndPassword(auth, email.value, password.value).catch((createAccountResults: AuthError) => {
      const errorMessage = mapAuthCodeToMessage(createAccountResults.code);
      error.value = errorMessage;
      loading.value = false;
      return 'error';
    });
    if (createAccountResults === 'error') return;

    modalGeneratorStore.escapeModal();
    modalGeneratorStore.openModal('payment');
    loading.value = false;
  }
  
  const forgetPassword = async () => {
    loading.value = 'forgetPassword';
    error.value = '';
    const createAccountResults = await sendPasswordResetEmail(auth, email.value).catch((createAccountResults: AuthError) => {
      const errorMessage = mapAuthCodeToMessage(createAccountResults.code);
      error.value = errorMessage;
      loading.value = false;
      return 'error';
    });
    if (createAccountResults === 'error') return;

    response.value = 'Password Reset Email Sent';
    loading.value = false;
  }
</script>

<template>
  <div class="flex flex-col items-center">
    <h1 class="subheader">Login or Register</h1>
    <img class="mt-4" width="64" src="/images/logo.svg"/>
    <TextInput class="mt-10" label="Email" type="email" @change="email = $event"/>
    <TextInput class="mt-3" label="Password" type="password" @change="password = $event"/>
    <div class="flex flex-row flex-wrap justify-evenly gap-2 mt-6">
      <ActionButton @click="logIn()" :loading="loading === 'signIn'" text="Sign In"/>
      <ActionButton @click="createAccount()" :loading="loading === 'createAccount'" text="Create Account"/>
      <ActionButton @click="forgetPassword()" :loading="loading === 'forgetPassword'" text="Forget Password"/>
    </div>
    <p v-if="response" class="paragraph mt-3 text-slate-500 w-3/4 text-center">{{ response }}</p>
    <p v-if="error" class="paragraph mt-3 text-red-600 w-3/4 text-center">{{ error }}</p>
  </div>
</template>

<style scoped>
</style>