const express = require("express");
const authController = require("../controller/Auth")

const router = express.Router();

router.post("/signup", authController.Signup);
router.post("/signin", authController.Signin);





module.exports = router;
