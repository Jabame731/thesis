import express from 'express';
import {
  cancelReservedParkingSpot,
  deleteReservation,
  reserveParkingSpot,
} from '../controllers/reservation.js';

const router = express.Router();

router.post('/reserveParkingSpot', reserveParkingSpot);
router.put('/cancelReservedParkingSpot/:id', cancelReservedParkingSpot);
router.delete('/deleteReservation/:id', deleteReservation);

export default router;
