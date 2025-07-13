const express = require('express');
const { createPlan, getPlan } = require('../controllers/plan');
const router = express.Router();

router.post('/create', createPlan);
router.get('/get', getPlan);

module.exports = router;
