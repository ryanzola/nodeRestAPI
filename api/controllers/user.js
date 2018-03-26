const { Client } = require("pg")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

// Database connection
const client = new Client({
  user: 'ryanzola',
  host: 'localhost',
  database: 'coolbooks',
  password: '11Passvip02',
  port: 5433
});
client.connect();

exports.user_signup = (req, res, next) => {
  client.query(
    'SELECT * FROM user WHERE email=$1'
  )
  .then(user => {
    if (user.length >= 1) {
      return res.status(409).json({
        message: 'this user already exists'
      })
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
            console.log(result);
            res.status(201).json({
              message: 'user created'
            })
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            })
          })
        }
      })
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err + `. Oh, and youre a moron!`
    })
  })
};

exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        res.status(401).json({
          message: "authentication failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "authentication failed"
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
              expiresIn: "1hr"
            }
          );
          return res.status(200).json({
            message: "authentication successful",
            token: token
          });
        }

        res.status(401).json({
          message: "authentication failed"
        });
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.user_delete = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "user deleted"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
