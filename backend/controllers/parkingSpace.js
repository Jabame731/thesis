import { connection } from '../config/db.js';
import jwt from 'jsonwebtoken';

//create parking space ==> admin
export const createParkingSpace = (req, res) => {
  const token = req.cookies.access_token;

  if (!token) return res.status(401).json('Token not valid');

  const { space_number, availability, parkingLotId } = req.body;

  //get the user information ==> admin or not
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const query = 'SELECT * FROM `user` WHERE `id` = ?';

  connection.query(query, [decoded.id], (err, data) => {
    if (err) res.status(401).json('token is not valid');

    if (data[0].user_role !== 'admin') {
      return res.status(401).json('Not Authorized');
    } else {
      //   const parkingLotId1 = 'SELECT * FROM `parking_lot` WHERE `id` = ?';

      const query =
        'INSERT INTO parking_space (`lot_id`, `space_number`, `availabilty`) VALUES (?)';

      const values = [parkingLotId, space_number, availability];

      //inserting the values to the database
      connection.query(query, [values], (err, data) => {
        if (err) return res.json(err);

        console.log(data[0]);
        return res.status(200).json('Parking space has been created');
      });
    }
  });
};

//get parking space ==> user, admin, guard
export const getParkingSpaces = (_, res) => {
  const query = 'SELECT * FROM parking_space';

  connection.query(query, (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data);
  });
};

//get by id parking space
export const getParkingSpaceById = (req, res) => {
  const parkingSpaceId = req.params.id;

  const query =
    'SELECT * FROM parking_space INNER JOIN parking_lot ON parking_space.lot_id = parking_lot.id';

  connection.query(query, [parkingSpaceId], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data[0]);
  });
};

//update parking space
export const updateParkingSpace = (req, res) => {
  const token = req.cookies.access_token;

  const { space_number, availabilty } = req.body;

  if (!token) return res.status(401).json('Not authenticated');

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const query = 'SELECT * FROM user WHERE id = ?';

  connection.query(query, [decoded.id], (err, data) => {
    if (err) return res.status(401).json('Token not valid');

    if (data[0].user_role !== 'admin') {
      return res.status(401).json('Not authorized');
    } else {
      const parkingSpaceId = req.params.id;

      const query =
        'UPDATE `parking_space` SET `space_number` = ?, `availabilty` = ? WHERE `id` = ?';

      const values = [space_number, availabilty];

      connection.query(query, [...values, parkingSpaceId], (err, data) => {
        if (err) return res.status(500).json(err);

        //fetch the updated parking space from the database

        const fetchUpdatedParkingSpace =
          'SELECT * FROM `parking_space` WHERE `id` = ?';

        connection.query(
          fetchUpdatedParkingSpace,
          [parkingSpaceId],
          (err, updatedData) => {
            if (err) return res.status(500).json(err);

            return res.status(200).json(updatedData[0]);
          }
        );
      });
    }
  });
};

// delete parking space ==> admin
export const deleteParkingSpace = (req, res) => {
  const token = req.cookies.access_token;

  if (!token) return res.status(401).json('Not Authenticated');

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const query = 'SELECT * FROM user WHERE id = ?';

  connection.query(query, [decoded.id], (err, data) => {
    if (err) return res.status(500).json(err);

    if (data[0].user_role !== 'admin') {
      return res.status(401).json('Not authorized');
    } else {
      const parkingSpaceId = req.params.id;

      const query = 'DELETE FROM parking_space WHERE `id` = ?';

      connection.query(query, [parkingSpaceId], (err, data) => {
        if (err) return res.status(500).json(err);

        return res.json('Parking Space has been deleted');
      });
    }
  });
};
