const User = require("../models/User");
const bcrypt = require("bcryptjs");
const _ = require("lodash");

exports.Signup = async (req, res, next) => {
  try {
    if (!(req.body.username && req.body.email && req.body.password)) {
      return res.status(404).json({ msg: "Check all input" });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
    });
    await user.save();
    return res.status(201).json({ msg: "done" });
  } catch (err) {
    return res.status(404).json({ msg: "There is wrong!,check all input" });
  }
};
exports.Signin = async (req, res, next) => {
  try {
    if (!(req.body.email && req.body.password)) {
      return res.status(404).json({ msg: "Check all input" });
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const result = await bcrypt.compare(req.body.password, user.password);
    return result
      ? res.status(200).json({
          user: _.omit(user.toObject(), ["createdAt", "updatedAt", "password","isAdmin"]),
        })
      : res.status(404).json({ msg: "password is wrong " });
  } catch (err) {
    return res.status(404).json({ msg: "There is wrong!,check all input" });
  }
};
