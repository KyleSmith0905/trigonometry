<script setup lang="ts">
  import { loadStripe, type StripeElements, type Stripe, type StripePaymentElement, type StripeError } from '@stripe/stripe-js'
  import { onBeforeMount, ref } from 'vue'
  import ActionButton from '../formElements/ActionButton.vue'
  import { useCurrentUser } from 'vuefire';

  const stripeKey = ref(import.meta.env.VITE_STRIPE_PUBLISHABLE);
  const stripeInstance = ref<Stripe>();
  const stripeElements = ref<StripeElements>();
  const paymentElement = ref<StripePaymentElement>();
  const stripeLoaded = ref(false);
  const error = ref('');
  const paymentDisabled = ref(false);

  const user = useCurrentUser();

  onBeforeMount(async () => {
    stripeInstance.value = await loadStripe(stripeKey.value) ?? undefined
    if (!stripeInstance.value) return;

    stripeElements.value = stripeInstance.value.elements({
      mode: 'payment',
      locale: 'en',
      currency: 'usd',
      amount: 295,
    })
    paymentElement.value = stripeElements.value.create('payment', {
      layout: {
        type: 'tabs',
        defaultCollapsed: false,
      }
    });

    paymentElement.value.once('ready', () => {
      stripeLoaded.value = true;
    })

    paymentElement.value.mount('#stripe-payment')
  })

  const handleError = (stripeError?: StripeError) => {
    paymentDisabled.value = false;
    error.value = stripeError?.type ?? 'An error occurred.';
  }

  const pay = async () => {
    paymentDisabled.value = true;
    error.value = '';
    const submitResponse = await stripeElements.value?.submit();
    if (!stripeInstance.value || !submitResponse || submitResponse.error) {
      handleError(submitResponse?.error);
      return;
    }

    const idTokenResult = await user.value?.getIdTokenResult(false);
    const idToken = idTokenResult?.token;

    // Create the PaymentIntent and obtain clientSecret
    const createPaymentIntentResponse = await fetch(import.meta.env.VITE_FUNCTIONS_CREATE_PAYMENT_INTENT, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    }).catch(() => {
      return null;
    });

    const paymentIntent = await createPaymentIntentResponse?.json();
    if (!paymentIntent || 'error' in paymentIntent || !('client_secret' in paymentIntent)) {
      handleError(paymentIntent?.error);
      return;
    }

    // Use the clientSecret and Elements instance to confirm the setup
    const confirmPayment = await stripeInstance.value.confirmPayment({
      elements: stripeElements.value,
      clientSecret: paymentIntent.client_secret,
      confirmParams: {
        return_url: `${location.protocol + "//" + location.host}/graph`,
      },
      redirect: 'always',
    });

    if (confirmPayment.error) {
      handleError(submitResponse?.error);
      return;
    }
  };
</script>

<template>
  <div class="flex flex-col items-center">
    <h1 class="subheader">Premium</h1>
    <div id="stripe-payment" class="w-11/12 mt-4"></div>
    <ActionButton v-if="stripeLoaded === true" @click="pay()" :loading="true" text="Pay" class="mt-8 w-32"/>
    <p class="paragraph mt-3 text-red-600 w-3/4 text-center">{{ error }}</p>
  </div>
</template>