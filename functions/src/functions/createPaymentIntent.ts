import { https } from "firebase-functions";
import { firebaseAuth } from "../utils/firebase";
import { stripe } from "../utils/stripe";

const createPaymentIntent = https.onRequest(async (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "POST");
  response.set("Access-Control-Allow-Headers", "*");
  response.set("Access-Control-Max-Age", "3600");

  if (request.method === "OPTIONS") {
    response.status(204).send();
    return;
  }

  const idToken = request.headers.authorization?.split("Bearer ")[1];
  if (!idToken) {
    response.status(401).end(JSON.stringify({error: "unauthorized"}));
    return;
  }
  const decodedIdToken = await firebaseAuth.verifyIdToken(idToken);

  const itemId = 'price_1Myj51JV8JwwTAwNKw64np0Q';
  const amount = 295;

  await stripe.paymentIntents.create({
    amount: amount,
    metadata: {itemId, userId: decodedIdToken.uid},
    currency: "usd",
    automatic_payment_methods: {enabled: true},
  })
  .then((intent) => {
    response.status(201).json(intent);
  })
  .catch((err) => {
    response.status(500).json(err);
  });

  return;
});

export { createPaymentIntent }