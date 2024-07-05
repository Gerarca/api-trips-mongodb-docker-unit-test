const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  lat: Number,
  lon: Number,
});

const ReadingSchema = new mongoose.Schema({
  time: Number,
  speed: Number,
  speedLimit: Number,
  location: LocationSchema,
  address: String,
});

const TripSchema = new mongoose.Schema({
  start: ReadingSchema,
  end: ReadingSchema,
  duration: Number,
  distance: Number,
  overspeedsCount: Number,
  boundingBox: [[Number]],
});

const Trip = mongoose.model('Trip', TripSchema);

module.exports = Trip;
