const express = require("express");
const Controller = require("../controllers/controller");

const studentRouter = express.Router();

studentRouter.get("/", (req, res) => {
  if (req.session.userId && req.session.role === "student") {
    res.redirect(`/home/student/${req.session.userId}`);
  } else {
    res.redirect("/login");
  }
});

studentRouter.get("/:studentId", Controller.homeStudent);
studentRouter.get("/:userId/category/:categoryId", Controller.coursesByCategory);
studentRouter.get("/:userId/course/:courseId", Controller.exercisesByCourse);
studentRouter.post("/:userId/course/:courseId/submit", Controller.submitExercises);

module.exports = studentRouter;
