import { https } from "firebase-functions";
import { stripe } from "../utils/stripe";
import { firebaseFirestore } from "../utils/firebase";

const webhookSigningSecret = `${process.env.WEBHOOK_SIGNING_SECRET}`;

const stripeWebhooks = https.onRequest((request, response) => {

  const signature = request.get("stripe-signature");

  if (!signature) {
    response.status(400).end();
    return;
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(request.rawBody.toString('utf8'), signature, webhookSigningSecret);
  }
  catch (err) {
    response.status(400).end()
    return;
  }

  if (event.type === 'payment_intent.succeeded') {
    const userId = (event.data.object as any)?.metadata?.userId;
    
    firebaseFirestore.collection('users').doc(userId).set({membership: 'premium'});
  }
  response.status(200).end();
  return;
});

export { stripeWebhooks };