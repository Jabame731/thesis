import { connection } from '../config/db.js';
import jwt from 'jsonwebtoken';
import { formatDate } from '../helpers/helper.js';

// reserve a parking spot ==> user
export const reserveParkingSpot = (req, res) => {
  const token = req.cookies.access_token;

  if (!token) return res.status(401).json('Not authenticated');

  const { vehicle_id, space_id, start_time, end_time } = req.body;

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json('Token is not valid');

    const query =
      'SELECT space_id FROM reservation reservation WHERE space_id = ?';

    connection.query(query, [space_id], (err, data) => {
      if (err) return res.status(500).json(err);

      if (data.length > 0)
        return res.status(409).json('Spot has been reserved');

      const query =
        'INSERT INTO reservation (`vehicle_id`, `space_id`, `start_time`, `end_time`, `user_id`) VALUES (?)';

      //update the availabilty in the parking_space if its reserved
      const updateAvailabilityQuery =
        'UPDATE parking_space SET availabilty = ? WHERE id = ?';

      const values = [
        vehicle_id,
        space_id,
        formatDate(start_time),
        formatDate(end_time),
        userInfo.id,
      ];

      //query to insert the values to the reservation
      connection.query(query, [values], (err, _) => {
        if (err) return res.status(500).json(err);

        const updateValues = ['Reserved', space_id];

        //query to update availability to reserved in the parking spacew
        connection.query(updateAvailabilityQuery, updateValues, (err) => {
          if (err) res.status(500).json(err);

          res.status(200).json('Parking spot has been reserved');
        });
      });
    });
  });
};

// delete a reserved parking spot

// function to send a signal to the arduino
