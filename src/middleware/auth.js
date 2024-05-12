const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, "nodejs");
    const user = await User.findOne({
      _id: decode._id,
      "tokens.token": token,
    });
    if (!user) {
      console.log('user not');
      throw new Error("Error");
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    res.status(500).send("Please Authenticate");
  }
};

module.exports = auth;
