var express = require("express");
var router = express.Router();
var checkAuth = require("../middleware/check-auth");
var UserController = require("../controllers/user");
router.post("/signup", UserController.user_signup);
router.post("/login", UserController.user_login);
router.delete("/:userId", checkAuth, UserController.user_delete);
module.exports = router;
