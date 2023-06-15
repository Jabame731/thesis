import { connection } from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { capitalizeFirstLetter } from '../helpers/helper.js';

export const registerUser = (req, res) => {
  //parsed request from body data
  const { first_name, last_name, email, password, image } = req.body;

  //check for existing user
  const query = 'SELECT * FROM user WHERE email = ?';

  connection.query(query, [email], (err, data) => {
    if (err) return res.json(err);

    if (data.length) return res.status(409).json('User Already Exist!');

    //hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const query =
      'INSERT INTO user (`first_name`, `last_name`, `email`, `password`, `image`) VALUES (?)';

    const values = [
      capitalizeFirstLetter(first_name),
      capitalizeFirstLetter(last_name),
      email,
      hash,
      image,
    ];

    connection.query(query, [values], (err, _) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json('User is Registered');
    });
  });
};

export const loginUser = (req, res) => {
  const query = 'SELECT * FROM user WHERE email = ?';

  connection.query(query, [req.body.email], (err, data) => {
    if (err) return res.json(err);

    if (data.length === 0) return res.status(404).json('User Not Found');

    //compare password
    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!isPasswordCorrect)
      return res.status(400).json('Wrong username or password');

    const token = jwt.sign({ id: data[0].id }, process.env.JWT_SECRET);
    const { password, ...other } = data[0];

    res
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .status(200)
      .json(other);
  });
};

export const logoutUser = (_, res) => {
  res
    .clearCookie('access_token', {
      sameSite: 'none',
      secure: true,
    })
    .status(200)
    .json('User has been logged out');
};
