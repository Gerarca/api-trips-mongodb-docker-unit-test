const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); 

describe('Trips API', () => {
  afterAll(async () => {
    await mongoose.connection.close(); 
  });

  it('should create a new trip', async () => {
    const response = await request(app)
      .post('/trips')
      .send({
        readings: [
          {
            time: 1642500462000,
            speed: 9,
            speedLimit: 38,
            location: { lat: -33.580158, lon: -70.567227 }
          },
          {
            time: 1642500466000,
            speed: 26,
            speedLimit: 38,
            location: { lat: -33.58013, lon: -70.566995 }
          },
          {
            time: 1642500470000,
            speed: 28,
            speedLimit: 38,
            location: { lat: -33.580117, lon: -70.566633 }
          },
          {
            time: 1642500474000,
            speed: 13,
            speedLimit: 38,
            location: { lat: -33.580078, lon: -70.566408 }
          },
          {
            time: 1642500478000,
            speed: 18,
            speedLimit: 38,
            location: { lat: -33.580005, lon: -70.566498 }
          }
        ]
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('start');
    expect(response.body).toHaveProperty('end');
  });

  it('should return trips with filters', async () => {
    const response = await request(app)
      .get('/trips')
      .query({
        start_gte: 1642500462000,
        start_lte: 1642500478000,
        distance_gte: 0.5,
        limit: 10,
        offset: 0
      });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });
});
