require('dotenv').config();
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';

// Database connection
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});

exports.user_signup = (req, res) => {
  pool.connect()
    .then(client => {
      client.query(
        'SELECT * FROM user WHERE email = $1',
        [req.body.email]
      )
        .then(user => {
          if (user.length >= 1) {
            return res.status(409).json({
              message: 'this user already exists'
            });
          } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
              if (err) {
                return res.status(500).json({
                  error: 'hi, ' + err
                });
              } else {
                client.query(
                  'INSERT INTO user(email, password, firstname, familyname) VALUES($1, $2, $3, $4)',
                  [req.body.email, hash, req.body.firstname, req.body.familyname]
                )
                  .then(result => {
                    console.info(result);
                    res.status(201).json({
                      message: 'user created'
                    });
                  })
                  .catch(err => {
                    console.error(err);
                    res.status(500).json({
                      error: err
                    });
                  });
              }
            });
          }
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({
            request: req.body,
            error: err + `. Oh, and youre a moron!`
          });
        });
    })
    .catch(err => {
      console.error('connection error', err.message, err.stack);
    });
};

exports.user_login = (req, res) => {
  pool.connect().then(client => {
    client.query()
      .then()
      .catch(err => {
        client.release();
        res.status(500).json({
          error: err
        });
      });
  }).catch(err => {
    console.error('connection error', err.message, err.stack);
  });

  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        res.status(401).json({
          message: 'authentication failed'
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'authentication failed'
          });
        }

        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: '1hr'
            }
          );
          return res.status(200).json({
            message: 'authentication successful',
            token: token
          });
        }

        res.status(401).json({
          message: 'authentication failed'
        });
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.user_delete = (req, res) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(() => {
      res.status(200).json({
        message: 'user deleted'
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
