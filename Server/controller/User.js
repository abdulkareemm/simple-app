const User = require("../models/User");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
exports.Edit = async (req, res, next) => {
  if (req.body.userId === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(404).json({ msg: "There is wrong!,check all input" });
      }
      try {
        const user = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
        return res.status(201).json({ msg: "Account has been updated" });
      } catch (err) {
        return res
          .status(403)
          .json({ msg: "you can update only your account" });
      }
    }
  } else {
    return res.status(403).json({ msg: "you can update only your account" });
  }
};
exports.Delete = async (req, res, next) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      return res.status(201).json({ msg: "Account has been deleted" });
    } catch (err) {
      return res.status(404).json({ msg: "There is wrong!" });
    }
  } else {
    return res.status(403).json({ msg: "you can update only your account" });
  }
};
exports.Get = async (req, res, next) => {
  try {
    const user = User.findById(req.params.id);
    return user
      ? res.status(200).json({
          user: _.omit(user.toObject(), [
            "createdAt",
            "updatedAt",
            "password",
            "isAdmin",
          ]),
        })
      : res.status(400).json({ msg: "user not found" });
  } catch (err) {
    return res.status(400).json({ msg: "there is wrong input!" });
  }
};

exports.Follow = async (req, res, next) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.params.id } });
        await currentUser.updateOne({
          $push: { followings: req.body.userId },
        });
        return res.status(203).json({ msg: "user has been followed " });
      } else {
        return res.status(403).json({ msg: "you alleardy follow this user" });
      }
    } catch (err) {
      return res.status(403).json({ msg: "there is wrong! check your inputs" });
    }
  } else {
    return res.status(404).json({ msg: "you cant follow your self" });
  }
};
exports.Unfollow = async (req, res, next) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.params.id } });
        await currentUser.updateOne({
          $pull: { followings: req.body.userId },
        });
        return res.status(203).json({ msg: "user has been unfollowed " });
      } else {
        return res.status(403).json({ msg: "you dont follow this user" });
      }
    } catch (err) {
      return res.status(403).json({ msg: "there is wrong! check your inputs" });
    }
  } else {
    return res.status(404).json({ msg: "you cant unfollow your self" });
  }
};