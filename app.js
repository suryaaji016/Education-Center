const express = require("express");
const session = require("express-session");

const indexRouter = require("./routes/index");
const studentRouter = require("./routes/studentRouter");
const teacherRouter = require("./routes/teacherRouter");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: "rahasia-bootcamp",
  resave: false,
  saveUninitialized: true,
}));

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// gunakan router
app.use("/", indexRouter);
app.use("/home/student", studentRouter);
app.use("/home/teacher", teacherRouter);

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
