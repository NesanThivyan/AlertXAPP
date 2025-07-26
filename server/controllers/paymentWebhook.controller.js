import Payment from "../models/payment.model.js";

// Health check endpoint
export const healthCheck = async (req, res) => {
  try {
    const count = await Payment.countDocuments();
    res.json({ status: "ok", paymentCount: count });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

// Stripe webhook handler
export const handleStripeWebhook = async (req, res, stripe) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Stripe webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("✅ Stripe webhook received:", event.type);

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Prevent duplicate saving
      const existing = await Payment.findOne({ sessionId: session.id });
      if (existing) {
        console.log("⚠️ Payment already exists in DB, skipping...");
        return res.json({ received: true });
      }

      await Payment.create({
        sessionId: session.id,
        amount: session.amount_total,
        currency: session.currency,
        status: session.payment_status, // Should be "paid"
        customerEmail: session.customer_details?.email,
        created: new Date(session.created * 1000),
      });

      console.log("✅ Checkout session payment saved to MongoDB.");

    } else if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      const existing = await Payment.findOne({ sessionId: paymentIntent.id });
      if (existing) {
        console.log("⚠️ PaymentIntent already exists in DB, skipping...");
        return res.json({ received: true });
      }

      await Payment.create({
        sessionId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status, // Should be "succeeded"
        customerEmail:
          paymentIntent.receipt_email ||
          paymentIntent.metadata?.userEmail ||
          null,
        created: new Date(paymentIntent.created * 1000),
      });

      console.log("✅ PaymentIntent saved to MongoDB.");
    }
  } catch (dbErr) {
    console.error("❌ Error saving payment to MongoDB:", dbErr);
  }

  res.json({ received: true });
};
