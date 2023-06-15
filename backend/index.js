import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import multer from 'multer';

//image upload functionality
const storage = multer.diskStorage({
  destination: (_, _, cb) => {
    cb(null, '../frontend/public/upload');
  },
  filename: (_, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

// route for image upload
app.post('api/upload', upload.single('file'), (req, res, next) => {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  const file = req.file;
  res.status(200).json(file.fieldname);
});

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
