require('dotenv').config();
import pool from '../database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const user_signup = (req, res) => {
  pool.connect()
    .then(client => {
      client.query(
        'SELECT * FROM users WHERE email = $1',
        [req.body.email]
      )
        .then(user => {
          console.info(user);
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
                  'INSERT INTO users(email, password, firstname, familyname) VALUES($1, $2, $3, $4)',
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
                      error: err + 'hej tho'
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

const user_login = (req, res) => {
  pool.connect()
    .then(client => {
      client.query('SELECT * FROM users WHERE email = $1', 
        [req.body.email]
      )
        .then(user => {
          // res.status(200).json( user.rowCount );
          if(user.rowCount < 1) {
            res.status(401).json({
              message: 'authentication failed 0'
            });
          } 
          bcrypt.compare(req.body.password, user.rows[0].password, (err, result) => {
            if (err) {
              return res.status(401).json({ 
                message: 'authentication failed 1'
              });
            }
            if (result) {
              const token = jwt.sign(
                {
                  email: user.rows[0].email,
                  userId: user.rows[0]._id
                },
                process.env.JWT_KEY,
                {
                  expiresIn: '1hr'
                }
              );
              return res.status(200).json({
                message: 'authentication successful',
                Authentication: token
              });
            }
            res.status(401).json({
              message: 'authentication failed 2'
            });
          });
        })
        .catch(err => {
          client.release();
          res.status(500).json({
            error: err
          });
        });
    })
    .catch(err => {
      console.error('connection error', err.message, err.stack);
    });
};

const user_delete = (req, res) => {
  pool.connect()
    .then(client => {
      client.query('DELETE FROM users WHERE _id=$1', 
        [req.params.userId]
      )
        .then(() => {
          res.status(204).json({
            message: 'user deleted'
          });
        })
        .catch(err => {
          res.status(500).json({
            error: `${err} but hej`
          });
        });
    })
    .catch(err => {
      console.error('connection error', err.message, err.stack);
    });
};

export default { user_signup, user_login, user_delete };