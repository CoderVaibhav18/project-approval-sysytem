const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const { setUser } = require("./service/auth");
const jwt = require("jsonwebtoken");
// const { type } = require("os");

mongoose
  .connect("mongodb://127.0.0.1:27017/pas")
  .then(() => console.log("Mongodb connect"))
  .catch((err) => console.log(err));

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);
const student = mongoose.model("student", userSchema);

const hodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);
const hod = mongoose.model("hod", hodSchema);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
  return res.render("home");
});

// for students routing
app.get("/student/signup", (req, res) => {
  return res.render("sstudentignup");
});
app.post("/student/signup", async (req, res) => {
  const { email, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await student.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ email, password }, "kdhbjhdsfjdv@@##$");
  res.cookie("token", token);
  // res.send("User Created")
  return res.redirect("/student/login");
});

app.get("/student/login", (req, res) => {
  return res.render("studentLogin");
});
app.post("/student/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await student.findOne({ email });
  if (!user)
    return res.render("login", { error: "Invalid username or password" });

  bcrypt.compare(password, user.password, (err, result) => {
    if (!result) res.send("incorrect");
    res.render("studentlanding", { studentName: user.name });
  });
});
app.get("/student/landing", (req, res) => {
  res.render("studentlanding");
});

app.get("/student/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
});

app.get("/student/Approval", (req, res) => {
  res.render("studentApproval");
});

// for hod routing
app.get("/hod/signup", (req, res) => {
  res.render("Hodsignup");
});
app.get("/hod/login", (req, res) => {
  res.render("Hodlogin");
});

app.post("/hod/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await hod.create({
    name,
    email,
    password: hashedPassword,
  });
  console.log(user);

  const token = jwt.sign({ email, password }, "hodmadarchod$@#");
  res.cookie("token", token);
  // res.send("User Created")
  return res.redirect("/hod/login");
});

app.post("/hod/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await hod.findOne({ email });
  console.log(user);
  
  if (!user)
    return res.render("login", { error: "Invalid username or password" });

  bcrypt.compare(password, user.password, (err, result) => {
    if (!result) res.send("incorrect");
    res.render("Hodlanding", {hodName: user.name});
  });
});
app.get("/hod/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/hod/login");
});

app.get("/hod/dashboard", (req, res) => {
  res.render("Hoddashboard")
})

app.listen(5555);
