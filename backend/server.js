const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const paymentRoutes = require('./routes/paymentRoutes');
const notificationRoute = require('./routes/tokenRoutes');
const plan = require('./routes/planRoutes');
const user = require('./routes/userRoutes');

app.use('/api/webhook', bodyParser.raw({ type: 'application/json' }));
dotenv.config();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/empData', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB Error', err));

app.use('/api', paymentRoutes);
app.use('/notification', notificationRoute);
app.use('/plan', plan);
app.use('/user', user);

app.listen(7000, () => {
  console.log('Server running at port 7000');
});


