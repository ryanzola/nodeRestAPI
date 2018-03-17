import {Router, Request, Response, NextFunction} from 'express';
const checkAuth = require("../middleware/check-auth")

import UserController from '../controllers/user'

export class UserRouter {
  router: Router;
  userController: UserController;

  // initialize the user router
  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.init();
  }


  // take each handler and attach one of the Express.Router's endpoints
  init() {
    this.router.post('/signup', this.userController.user_login);
    this.router.post('/login', this.userController.user_login);
    this.router.delete('/:userId', checkAuth, this.userController.user_delete);
  }

}

// create the UserRouter, and export its configured Express.Router
const userRoutes = new UserRouter();
userRoutes.init();
const router = userRoutes.router;
export default router;
