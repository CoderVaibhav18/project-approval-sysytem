const jwt = require("jsonwebtoken");
const screte = "Vaibhav$18";

const setUser = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      password: user.password,
    },
    screte
  );
};
const getUser = (token) => {
  if (!token) return null;
  return jwt.verify(token, screte);
};
module.exports = {
  setUser,
  getUser,
};
