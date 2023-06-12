import express from 'express';
import {
  createParkingSpace,
  deleteParkingSpace,
  getParkingSpaceById,
  getParkingSpaces,
  updateParkingSpace,
} from '../controllers/parkingSpace.js';

const router = express.Router();

router.post('/createParkingSpace', createParkingSpace);
router.get('/getParkingSpaces', getParkingSpaces);
router.get('/getParkingSpaceById/:id', getParkingSpaceById);
router.put('/updateParkingSpace/:id', updateParkingSpace);
router.delete('/deleteParkingSpace/:id', deleteParkingSpace);

export default router;
