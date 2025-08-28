require('dotenv').config();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/Payment");
const Token = require("../models/Token");
const admin = require("firebase-admin");
const serviceAccount = require('../firebase/serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const YOUR_DOMAIN = "http://localhost:3000";

const createCheckoutSession = async (req, res) => {
  const { name, image, amount, quantity, currency = "usd", userId, planId } = req.body;

  if (!name || !image || !amount || !quantity) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name, images: [image] },
            unit_amount: amount,
          },
          quantity,
        },
      ],
      mode: "payment",
      // success_url: `${YOUR_DOMAIN}?success=true`,
      success_url: `${YOUR_DOMAIN}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    });

    const payment = new Payment({
      userId,
      planId,
      name,
      image,
      amount,
      quantity,
      currency,
      stripePaymentId: session.id,
      status: "pending",
    });

    await payment.save();

    res.status(200).json({ url: session.url,
      data: payment
     });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// const handlePaymentSuccess = async (req, res) => {
//   try {
//     const { session_id } = req.query;

//     if (!session_id) {
//       return res.status(400).json({ error: "Missing session ID" });
//     }

//     const session = await stripe.checkout.sessions.retrieve(session_id);

//     if (session.payment_status === "paid") {
//       await Payment.findOneAndUpdate(
//         { stripePaymentId: session_id },
//         { status: "paid" }
//       );

//       const YOUR_DOMAIN = "http://localhost:3000";

//       const tokens = await Token.find({});
//       const payload = {
//         notification: {
//           title: "Payment Successful",
//           body: `Thank you for your purchase of ${
//             session.amount_total / 100
//           } ${session.currency.toUpperCase()}`,
//         },
//       };

//       await Promise.all(
//         tokens.map(({ token }) => admin.messaging().send({ ...payload, token }))
//       );

//       return res.redirect(`${YOUR_DOMAIN}?success=true`);
//     } else {
//       return res.status(400).json({ error: "Payment not completed" });
//     }
//   } catch (err) {
//     console.error("Payment success error:", err.message);
//     return res.status(500).json({ error: err.message });
//   }
// };

const endpointSecret =
  "whsec_4e3f43ddf8af03649a62f116e3bb93e134115c490335761a071f32cfb36c1098";

const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    await Payment.findOneAndUpdate(
      { stripePaymentId: session.id },
      { status: "paid" }
    );
  }

  // Send Notification to all saved tokens
    const tokens = await Token.find({});
    const deviceTokens = tokens.map(t => t.token);

    if (deviceTokens.length > 0) {
      const message = {
        notification: {
          title: "Payment Successful 🎉",
          body: "Your payment has been processed successfully.",
        },
        tokens: deviceTokens
      };
      try {
        await admin.messaging().sendEachForMulticast(message);
        console.log("✅ Notification sent to all users");
      } catch (error) {
        console.error("❌ Error sending notification:", error);
      }
    }
  

  res.json({ received: true });
};

// module.exports = { createCheckoutSession, stripeWebhook, handlePaymentSuccess };
module.exports = { createCheckoutSession, stripeWebhook };



