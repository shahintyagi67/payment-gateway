const Token = require('../models/Token');
const serviceAccount = require('../firebase/serviceAccountKey.json');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

 const saveToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token is required' });
    const exists = await Token.findOne({ token });
    if (!exists) {
      await Token.create({ token });
    }
    res.status(200).json({ message: 'Token saved successfully', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const sendNotification = async (req, res) => {
  try {
    const tokens = await Token.find({});
    const payload = {
    notification: {
        title: req.body.title || 'Default Title',
        body: req.body.body || 'Default Message',
      },
    };
    const response = await Promise.all(
      tokens.map(({ token }) => admin.messaging().send({ ...payload, token }))
    );

    res.status(200).json({ message: 'Notifications sent successfully', response });
  } catch (err) {
    console.error('Notification Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  saveToken,
  sendNotification,
};
