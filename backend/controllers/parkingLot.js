import { connection } from '../config/db.js';
import jwt from 'jsonwebtoken';
import { formatDate } from '../helpers/helper.js';

//create  ==> admin
export const createParkingLot = (req, res) => {
  const token = req.cookies.access_token;
  const { name, address, capacity } = req.body;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const query = 'SELECT * FROM `user` WHERE `id` = ?';

  connection.query(query, [decoded.id], (err, data) => {
    if (err) res.status(401).json('Token is not valid');

    if (data[0].user_role !== 'admin') {
      return res.status(401).json('Not Authorized');
    } else {
      const query =
        'INSERT INTO parking_lot (`name`, `address`, `capacity`) VALUES (?)';

      const values = [name, address, capacity];

      connection.query(query, [values], (err, data) => {
        if (err) return res.json(err);

        return res.status(200).json('Parking Lot has been Created');
      });
    }
  });
};

// update  ==> admin
export const updateParkingLot = (req, res) => {
  const token = req.cookies.access_token;
  const { name, address, capacity } = req.body;

  if (!token) return res.status(401).json('Not authenticated');

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const query = 'SELECT * FROM `user` WHERE `id` = ?';

  connection.query(query, [decoded.id], (err, data) => {
    if (err) res.status(401).json('Token not valid');

    if (data[0].user_role !== 'admin') {
      return res.status(401).json('Not authorized');
    } else {
      const parkingLotId = req.params.id;

      const query =
        'UPDATE `parking_lot` SET `name` = ?, `address` = ?, `capacity` =?, `updated_at` = ?  WHERE `id` = ?';

      const values = [name, address, capacity, formatDate()];

      connection.query(query, [...values, parkingLotId], (err, _) => {
        if (err) return res.status(500).json(err);

        //fetch the updated parking lot from the database
        const fetchUpdatedParkingLot =
          'SELECT * FROM `parking_lot` WHERE `id` = ?';

        connection.query(
          fetchUpdatedParkingLot,
          [parkingLotId],
          (err, updatedData) => {
            if (err) return res.status(500).json(err);

            return res.status(200).json(updatedData[0]);
          }
        );
      });
    }
  });
};

// get ===> user, admin, guard
export const getParkingLotById = (req, res) => {
  const parkingLotId = req.params.id;

  const query = 'SELECT * FROM parking_lot WHERE id = ?';

  connection.query(query, [parkingLotId], (err, data) => {
    if (err) return res.status(500).json(err);

    if (data.length === 0) return res.status(404).json('Parking lot not found');

    return res.status(200).json(data[0]);
  });
};

// get all ==> user, admin, guard
export const getParkingLotLists = (_, res) => {
  const query = 'SELECT * FROM parking_lot LIMIT 10';

  connection.query(query, (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data);
  });
};

// delete ==> admin
export const deleteParkingLot = (req, res) => {
  const token = req.cookies.access_token;

  if (!token) return res.status(401).json('Not authenticated');

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const query = 'SELECT * FROM user WHERE id = ?';

  connection.query(query, [decoded.id], (err, data) => {
    if (err) return res.status(500).json(err);

    if (data[0].user_role !== 'admin') {
      return res.status(401).json('Not authorized');
    } else {
      const parkingLotId = req.params.id;

      const query = 'DELETE FROM parking_lot WHERE `id` = ?';

      connection.query(query, [parkingLotId], (err, data) => {
        if (err) return res.status(500).json(err);

        return res.json('Parking lot has been deleted');
      });
    }
  });
};
