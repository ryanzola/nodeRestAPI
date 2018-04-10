require('dotenv').config();
import jwt from 'jsonwebtoken';

module.exports = (req, res, next) => {
  try {
    const token = req.headers.token;
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: 'authentication failed again'
    });
  }
  next();
};
