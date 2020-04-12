"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Excersises = new Schema({
  userId: { type: String, required: true },
  description: { type: String, requierd: true },
  duration: { type: Number, requierd: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Excersises", Excersises);
