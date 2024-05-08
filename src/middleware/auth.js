const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const header = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(header, "nodejs");
    const user = await User.findOne({
      _id: decode._id,
      "tokens.token": header,
    });
    if (!user) {
      throw new Error("Error");
    }
    req.myuser = user;
    next();
  } catch (e) {
    res.status(500).send("Authentication needed!");
  }
};

module.exports = auth;
