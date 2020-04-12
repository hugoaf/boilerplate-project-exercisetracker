//"use strict";
const router = require("express").Router();

var UserModel = require("../models/users.js");
var ExcerciseModel = require("../models/exercises.js");

router.post("/new-user", (req, res, next) => {
  var newUser = new UserModel({
    username: req.body.username,
  });
  newUser.save((err, data) => {
    if (err) {
      return;
    }
    res.json({ username: data.username, _id: data._id });
  });
});

router.get("/users", (req, res, next) => {
  UserModel.find({}, (err, data) => {
    res.json(data);
  });
});

router.post("/add", (req, res, next) => {
  var myDate;
  if (!req.body.date) req.body.date = Date.now();
  var newExcercise = new ExcerciseModel({
    userId: req.body.userId,
    description: req.body.description,
    duration: req.body.duration,
    date: req.body.date,
  });
  newExcercise.save((err, excercise) => {
    if (err) {
      return;
    }
    UserModel.findById(req.body.userId, (err, user) => {
      if (err) {
        return;
      }

      var date = new Date(excercise.date);
      res.json({
        username: user.username,
        description: excercise.description,
        duration: excercise.duration,
        _id: user._id,
        date: date.toDateString(),
      });
    });
  });
});

router.get("/log", (req, res, next) => {
  console.log(req.query.userId);
  UserModel.findById(req.query.userId, (err, user) => {
    if (err) {
      return;
    }
    console.log(user);

    var from, to, query;

    if (req.query.from && req.query.to) {
      from = new Date(req.query.from);
      to = new Date(req.query.to);
      query = {
        userId: user._id,
        date: {
          $lt: to != "Invalid Date" ? to.getTime() : Date.now(),
          $gt: from != "Invalid Date" ? from.getTime() : 0,
        },
      };
    } else {
      query = { userId: user._id };
    }

    ExcerciseModel.find(query)
      .limit(parseInt(req.query.limit))
      .exec((err, exercises) => {
        if (err) {
          return;
        }
        res.json({
          _id: user._id,
          username: user.username,
          count: exercises.length,
          _id: user._id,
          log: exercises,
        });
      });
  });
});

module.exports = router;
