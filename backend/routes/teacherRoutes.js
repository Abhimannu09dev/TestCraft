var express = require("express");


const {createQuestionSetController} = require("../controller/teacherController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { teacherOnlyMiddleware} = require("../middleware/roleMiddleware");
var router = express.Router();

router.post(
  "/questionset/create",
  authMiddleware,
  teacherOnlyMiddleware,
  createQuestionSetController
);

module.exports = router;