const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: "usd",
  },
  quantity: {
    type: Number,
    required: true,
  },
  stripePaymentId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
