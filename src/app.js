const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const tripsRoutes = require('./routes/trips');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors()); 
app.use(bodyParser.json());
app.use('/trips', tripsRoutes);

const MONGO_URI = process.env.MONGO_URI; 

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });

module.exports = app;