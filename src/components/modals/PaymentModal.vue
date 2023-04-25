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
  const errorRef = ref<HTMLParagraphElement>();

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

  const handleError = (stripeError?: StripeError | string) => {
    paymentDisabled.value = false;
    if (typeof stripeError === 'string') {
      error.value = stripeError;
    }
    else {
      error.value = stripeError?.message ?? 'An error occurred.';
    }
    setTimeout(() => {
      errorRef.value?.scrollIntoView(false);
    })
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
      handleError(paymentIntent);
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
    })

    if (!confirmPayment || confirmPayment.error) {
      handleError(confirmPayment.error ?? 'There was an error confirming payment, make sure your card is correct.');
      return;
    }
  };
</script>

<template>
  <div class="flex flex-col items-center">
    <h1 class="subheader">Premium</h1>
    <p class="paragraph w-3/4 text-center">Purchase premium for $2.95!</p>
    <p class="paragraph w-3/4 text-center">Unlock extra trigonometric functions and support the creator.</p>
    <div id="stripe-payment" class="w-11/12 mt-4"></div>
    <ActionButton v-if="stripeLoaded === true" @click="pay()" :loading="paymentDisabled" text="Pay" class="mt-8 w-32"/>
    <p ref="errorRef" class="paragraph mt-3 text-red-600 w-3/4 text-center">{{ error }}</p>
  </div>
</template>