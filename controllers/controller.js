const { User, Category, Course, Exercise, Score } = require("../models");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

class Controller {
  static async home(req, res) {
    try {
      const { search } = req.query;
      const option = { include: Category };

      if (search) {
        option.where = { name: { [Op.iLike]: `%${search}%` } };
      }

      const courses = await Course.findAll(option);
      res.render("home", { courses, search, session: req.session });
    } catch (error) {
      console.log(" Home error:", error);
      res.send(error.message);
    }
  }

  static async categories(req, res) {
    try {
      const categories = await Category.findAll({ include: [Course] });
      res.render("categories", { categories, session: req.session });
    } catch (error) {
      res.send(error.message);
    }
  }

  static async coursesByCategory(req, res) {
    try {
      const { userId, categoryId } = req.params;
      const courses = await Course.findAll({ where: { categoryId } });
      res.render("coursesByCategory", { courses, userId, categoryId, session: req.session });
    } catch (error) {
      console.log(" coursesByCategory error:", error);
      res.send(error.message);
    }
  }

static loginForm(req, res) {
  res.render("login", { errors: [] }); 
}

static async loginPost(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error(" Email & password wajib diisi!");

    const user = await User.findOne({ where: { email: (email || "").trim() } });
    if (!user) throw new Error(" User tidak ditemukan!");

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) throw new Error(" Password salah!");

    req.session.userId = user.id;
    req.session.role = user.role;

    if (user.role === "student") return res.redirect(`/home/student/${user.id}`);
    return res.redirect(`/home/teacher/${user.id}`);
  } catch (error) {
    res.render("login", { errors: [error.message] }); 
  }
}

static registerForm(req, res) {
  res.render("register", { errors: [] }); 
}

static async registerPost(req, res) {
  try {
    let {  email, password, role } = req.body;
    if (!email) throw new Error(" Email tidak boleh kosong!");
    if (!password) throw new Error(" Password tidak boleh kosong!");
    if (password.length < 8) throw new Error(" Password minimal 8 karakter!");

    if (!role) role = "student";

    const existing = await User.findOne({ where: { email } });
    if (existing) throw new Error(" Email sudah terdaftar!");

    await User.create({ username, email, password, role });
    res.redirect("/login");
  } catch (error) {
    let messages = [];
    if (error.name === "SequelizeValidationError") {
      messages = error.errors.map(e => e.message);
    } else {
      messages = [error.message];
    }
    res.render("register", { errors: messages });
  }
}



  static logout(req, res) {
  req.session.destroy(err => {
    if (err) {
      console.log(" Logout error:", err);
      return res.send("Gagal logout");
    }
    res.redirect("/login");
  });
}

  static async homeStudent(req, res) {
    try {
      const { studentId } = req.params;
      const categories = await Category.findAll();
      res.render("homeStudent", { categories, userId: studentId, session: req.session });
    } catch (error) {
      res.send(error.message);
    }
  }

  static async exercisesByCourse(req, res) {
    try {
      const { userId, courseId } = req.params;
      const exercises = await Exercise.findAll({ where: { courseId } });
      res.render("exercises", { exercises, userId, courseId, session: req.session });
    } catch (error) {
      res.send(error.message);
    }
  }

  static async submitExercises(req, res) {
  try {
    const { userId, courseId } = req.params;
    const answers = req.body;

    const exercises = await Exercise.findAll({ where: { courseId } });

    let correct = 0;
    let details = [];

    for (let ex of exercises) {
      const studentAnswer = (answers[`answer_${ex.id}`] || "").trim().toLowerCase();
      const correctAnswer = (ex.answerKey || "").trim().toLowerCase();

      const isCorrect = studentAnswer === correctAnswer;
      if (isCorrect) correct++;

      await Score.create({
        userId: +userId,
        exerciseId: ex.id,
        finalScore: isCorrect ? 1 : 0  
      });

      details.push({ question: ex.question, studentAnswer, correctAnswer, isCorrect });
    }

    res.render("result", {
      userId,
      score: correct * 10,
      total: exercises.length,
      details,
      session: req.session
    });
  } catch (error) {
    console.log(" Submit error:", error);
    res.send(error.message);
  }
}

static async homeTeacher(req, res) {
  try {
    const { teacherId } = req.params;

    const scores = await Score.findAll({
      include: [
        { model: User },
        {
          model: Exercise,
          include: {
            model: Course,
            include: Category
          }
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    const categories = await Category.findAll({
      include: {
        model: Course,
        include: [Exercise]
      }
    });


    const chartDataPerCategory = [];

    categories.forEach(cat => {
      const studentScores = {};

      scores.forEach(s => {
        if (s.Exercise?.Course?.Category?.name === cat.name) {
          const email = s.User?.email || "Unknown";
          if (!studentScores[email]) studentScores[email] = 0;
          studentScores[email] += s.nilaiFinal; 
        }
      });

      chartDataPerCategory.push({
        name: cat.name,
        labels: Object.keys(studentScores),
        scores: Object.values(studentScores)
      });
    });

    res.render("homeTeacher", {
      teacherId,
      categories,
      session: req.session,
      scores,               
      chartDataPerCategory
    });

  } catch (error) {
    console.log(" Teacher home error:", error);
    res.send(error.message);
  }
}

static async addExerciseForm(req, res) {
  try {
    const { teacherId } = req.params;

    const categories = await Category.findAll({
      include: [Course]
    });

    res.render("addExercise", {
      teacherId,
      categories,   
      session: req.session
    });
  } catch (error) {
    res.send(error.message);
  }
}
static async addExercisePost(req, res) {
  try {
    const { teacherId } = req.params;
    const { question, answerKey, courseId } = req.body;

    await Exercise.create({ question, answerKey, courseId });

    res.redirect(`/home/teacher/${teacherId}`);
  } catch (error) {
    res.send(error.message);
  }
}

static async editExerciseForm(req, res) {
  try {
    const { teacherId, exerciseId } = req.params;

    const exercise = await Exercise.findByPk(exerciseId, {
      include: Course
    });
    const categories = await Category.findAll({ include: Course });

    if (!exercise) {
      return res.status(404).send(" Soal tidak ditemukan");
    }

    res.render("editExercise", {
      teacherId,
      exercise,
      categories,
      session: req.session
    });
  } catch (error) {
    res.send(error.message);
  }
}

static async editExercisePost(req, res) {
  try {
    const { teacherId, exerciseId } = req.params;
    const { question, answerKey, courseId } = req.body;

    await Exercise.update(
      { question, answerKey, courseId },
      { where: { id: exerciseId } }
    );

    res.redirect(`/home/teacher/${teacherId}`);
  } catch (error) {
    res.send(error.message);
  }
}

static async deleteExercise(req, res) {
  try {
    const { teacherId, exerciseId } = req.params;
    await Exercise.destroy({ where: { id: exerciseId } });
    res.redirect(`/home/teacher/${teacherId}`);
  } catch (error) {
    res.send(error.message);
  }
}
}

module.exports = Controller;
