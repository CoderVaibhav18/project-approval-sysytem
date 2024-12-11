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

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
  return res.render("home");
});
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
    if(!result) res.send("incorrect password")
    res.send("login")
  });
});

app.get("/student/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
});

app.listen(5555);
const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const { setUser } = require("./service/auth");
const jwt = require("jsonwebtoken");

mongoose
  .connect("mongodb://127.0.0.1:27017/pas", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongodb connect"))
  .catch((err) => console.log(err));

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  { timestamps: true }
);
const student = mongoose.model("student", userSchema);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  return res.render("home");
});
app.get("/student/signup", (req, res) => {
  return res.render("studentSignup");
});
app.post("/student/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await student.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign({ email, password }, "kdhbjhdsfjdv@@##$");
    res.cookie("token", token);
    return res.redirect("/student/login");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error creating user");
  }
});

app.get("/student/login", (req, res) => {
  return res.render("studentLogin");
});
app.post("/student/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await student.findOne({ email });
    if (!user)
      return res.render("login", { error: "Invalid username or password" });
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.send("Incorrect password");
    const token = jwt.sign({ email, password }, "kdhbjhdsfjdv@@##$");
    res.cookie("token", token);
    return res.redirect("/student/dashboard");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error logging in");
  }
});

app.get("/student/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
});

app.listen(5555, () => {
  console.log("Server listening on port 5555");
});