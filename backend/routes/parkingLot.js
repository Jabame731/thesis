import express from 'express';
import {
  createParkingLot,
  deleteParkingLot,
  getParkingLotById,
  getParkingLotLists,
  updateParkingLot,
} from '../controllers/parkingLot.js';

const router = express.Router();

router.post('/createParkingLot', createParkingLot);
router.put('/editParkingLot/:id', updateParkingLot);
router.get('/getParkingLotById/:id', getParkingLotById);
router.get('/getParkingLotLists', getParkingLotLists);
router.delete('/deleteParkingLot/:id', deleteParkingLot);

export default router;
