const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Task = require("../models/task");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(email) {
      if (!validator.isEmail(email)) {
        throw new Error("Invalid Email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 6,
    validate(password) {
      if (validator.contains(password, "password")) {
        throw new Error("password Invalid");
      }
    },
  },
  age: {
    type: Number,
    trim: true,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be positive");
      }
    },
  },
  tokens: [
    {
      token: { type: String, required: true },
    },
  ],
},
{
  timestamps:true
});

//-----To generate JWT token
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "nodejs");
  user.tokens = user.tokens.concat({ token: token });
  await user.save();
  return token;
};

//-----to send only necessary data to the user as part of response
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

//-----user-defined function
userSchema.statics.findUserByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error("Unable to login!");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login!");
  }

  return user;
};

//-----Function to hash the plain text password
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// //-----Function to delete all the task of the user, if user is deleted
// userSchema.pre("remove", async function (next) {
//   const user = this;
//   await Task.deleteMany({ owner: user._id });
//   next();
// });

const User = mongoose.model("User", userSchema);

module.exports = User;
