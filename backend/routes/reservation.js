import express from 'express';
import { reserveParkingSpot } from '../controllers/reservation.js';

const router = express.Router();

router.post('/reserveParkingSpot', reserveParkingSpot);

export default router;
