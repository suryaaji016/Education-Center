const express = require("express");
const Controller = require("../controllers/controller");

const teacherRouter = express.Router();

teacherRouter.get("/", (req, res) => {
  if (req.session.userId && req.session.role === "teacher") {
    res.redirect(`/home/teacher/${req.session.userId}`);
  } else {
    res.redirect("/login");
  }
});

teacherRouter.get("/:teacherId", Controller.homeTeacher);
teacherRouter.get("/:teacherId/exercise/add", Controller.addExerciseForm);
teacherRouter.post("/:teacherId/exercise/add", Controller.addExercisePost);
teacherRouter.get("/:teacherId/exercise/:exerciseId/edit", Controller.editExerciseForm);
teacherRouter.post("/:teacherId/exercise/:exerciseId/edit", Controller.editExercisePost);
teacherRouter.post("/:teacherId/exercise/:exerciseId/delete", Controller.deleteExercise);

module.exports = teacherRouter;
