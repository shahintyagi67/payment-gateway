const express = require('express');
const { saveToken, sendNotification } = require('../controllers/notificationController');
const router = express.Router();

router.post('/save-token', saveToken);
router.post('/send-notification', sendNotification);

module.exports = router;
