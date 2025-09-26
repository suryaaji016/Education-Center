const express = require("express");
const Controller = require("../controllers/controller");

const router = express.Router();

// Auth routes
router.get("/", Controller.home);
router.get("/categories", Controller.categories);

router.get("/login", Controller.loginForm);
router.post("/login", Controller.loginPost);
router.get("/register", Controller.registerForm);
router.post("/register", Controller.registerPost);
router.get("/logout", Controller.logout);

module.exports = router;
