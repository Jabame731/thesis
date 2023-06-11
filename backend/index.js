import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

//import from routes
import authRoutes from './routes/auth.js';
import vehicleRoutes from './routes/vehicle.js';

const app = express();

dotenv.config();
app.use(cookieParser());
app.use(express.json());

//routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicle', vehicleRoutes);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});
