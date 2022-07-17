const express = require("express");
const userController = require("../controller/User");


const router = express.Router();
router.put("/:id", userController.Edit);
router.delete("/:id", userController.Delete);
router.get("/:id", userController.Get);
router.put("/:id/follow", userController.Follow);
router.put("/:id/unfollow", userController.Unfollow);


module.exports = router;
