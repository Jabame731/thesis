import express from 'express';
import {
  deleteVehicle,
  getVehicleInformation,
  getVehicleLists,
  registerVehicle,
} from '../controllers/vehicle.js';

const router = express.Router();

router.post('/registerVehicle', registerVehicle);
router.get('/getVehicleLists', getVehicleLists);
router.get('/getVehicle/:id', getVehicleInformation);
router.delete('/deleteVehicle/:id', deleteVehicle);

export default router;
