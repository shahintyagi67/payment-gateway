const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController')

router.post('/create-payment-intent', paymentController.createCheckoutSession );
router.post('/webhook', paymentController.stripeWebhook);
// router.get('/payment-success', paymentController.handlePaymentSuccess);

module.exports = router;
