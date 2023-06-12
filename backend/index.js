import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

//import from routes
import authRoutes from './routes/auth.js';
import vehicleRoutes from './routes/vehicle.js';
import parkingLotRoutes from './routes/parkingLot.js';
import parkingSpaceRoutes from './routes/parkingSpace.js';
import reservationRoutes from './routes/reservation.js';

const app = express();

dotenv.config();
app.use(cookieParser());
app.use(express.json());

//routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/parkingLot', parkingLotRoutes);
app.use('/api/parkingSpace', parkingSpaceRoutes);
app.use('/api/reservation', reservationRoutes);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});
