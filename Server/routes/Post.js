const express = require("express");
const postController = require("../controller/Post");
const router = express.Router();

router.post("/create", postController.Create);
router.put("/:id", postController.Edit);
router.delete("/:id", postController.Delete);
router.put("/:id", postController.Like);
router.get("/:id", postController.Get);

module.exports = router;
