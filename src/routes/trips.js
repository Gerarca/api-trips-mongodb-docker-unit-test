const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const { getAddressFromCoords, calculateTripMetrics } = require('../utils/tripUtils');

router.post('/', async (req, res) => {
  try {
    const readings = req.body.readings;

    if (!Array.isArray(readings) || readings.length < 5) {
      return res.status(400).json({ error: 'Invalid readings array' });
    }

    const tripMetrics = calculateTripMetrics(readings);

    tripMetrics.start.address = await getAddressFromCoords(tripMetrics.start.location.lat, tripMetrics.start.location.lon);
    tripMetrics.end.address = await getAddressFromCoords(tripMetrics.end.location.lat, tripMetrics.end.location.lon);

    const trip = new Trip(tripMetrics);
    await trip.save();

    res.status(201).json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { start_gte, start_lte, distance_gte, limit = 10, offset = 0 } = req.query;

    const filters = {};

    if (start_gte) {
      const startGteDate = new Date(Number(start_gte));
      if (!isNaN(startGteDate.getTime())) {
        filters['start.time'] = { $gte: startGteDate.getTime() };
      } else {
        return res.status(400).json({ error: 'Invalid start_gte value' });
      }
    }

    if (start_lte) {
      const startLteDate = new Date(Number(start_lte));
      if (!isNaN(startLteDate.getTime())) {
        filters['start.time'] = filters['start.time']
          ? { ...filters['start.time'], $lte: startLteDate.getTime() }
          : { $lte: startLteDate.getTime() };
      } else {
        return res.status(400).json({ error: 'Invalid start_lte value' });
      }
    }
    
    if (distance_gte) {
      const distance = Number(distance_gte);
      if (!isNaN(distance)) {
        filters['distance'] = { $gte: distance };
      } else {
        return res.status(400).json({ error: 'Invalid distance_gte value' });
      }
    }

    // Contar el número total de documentos que coinciden con los filtros
    const totalTrips = await Trip.countDocuments(filters);

    // Obtener los documentos paginados
    const trips = await Trip.find(filters)
      .skip(Number(offset))
      .limit(Number(limit));

    // Devolver los viajes junto con el número total de viajes
    res.status(200).json({ trips, total: totalTrips });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
