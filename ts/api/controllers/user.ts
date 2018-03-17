import { NextFunction, Request, Response, Router } from 'express';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';

export default class UserController {
  constructor() {}

  user_signup(req: Request, res: Response, next: NextFunction) {
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length >= 1) {
          return res.status(409).json({
            message: 'this user already exists'
          });
        } else {
          bcrypt.hash(req.body.password, null, (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err
              });
            } else {
              const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash
              });

              user
                .save()
                .then(result => {
                  console.log(result);
                  res.status(201).json({
                    message: 'user created'
                  });
                })
                .catch(err => {
                  console.log(err);
                  res.status(500).json({
                    error: err
                  });
                });
            }
          });
        }
      });
  }

  user_login(req: Request, res: Response, next: NextFunction) {
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length < 1) {
          res.status(401).json({
            message: 'authentication failed'
          });
        }
        bcrypt.compare(
          req.body.password,
          user[0].password.toString(),
          (err, result) => {
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
          }
        );
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  }

  user_delete(req: Request, res: Response, next: NextFunction) {
    User.remove({ _id: req.params.userId })
      .exec()
      .then(result => {
        res.status(200).json({
          message: 'user deleted'
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  }
}
