"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkAuth = require("../middleware/check-auth");
const user_1 = require("../controllers/user");
class UserRouter {
    // initialize the user router
    constructor() {
        this.router = express_1.Router();
        this.userController = new user_1.default();
        this.init();
    }
    // take each handler and attach one of the Express.Router's endpoints
    init() {
        this.router.post('/signup', this.userController.user_login);
        this.router.post('/login', this.userController.user_login);
        this.router.delete('/:userId', this.userController.user_delete);
    }
}
exports.UserRouter = UserRouter;
// create the UserRouter, and export its configured Express.Router
const userRoutes = new UserRouter();
userRoutes.init();
const router = userRoutes.router;
exports.default = router;
