"use strict";

const stressModel = require("../models/stressModel");
const { validationResult } = require("express-validator");

const stress_post = async (req, res) => {
  const stressResult = req.body;
  const stressResultId = await stressModel.insertStressResult(stressResult);
  res.json({ message: `Stress result id:  ${stressResultId}` });
};

const stress_result_get = async (req, res) => {
  try {
    const result = await stressModel.getUserResult(req.user.userid);
    res.json(result);
  } catch (e) {
    console.log("erRRR controller", e.message);
  }
};

const stress_comment_get = async (req, res) => {
  try {
    const result = await stressModel.getUserComment(req.user.userid);
    res.json(result);
  } catch (e) {
    console.log("erRRR controller", e.message);
  }
};

const checkToken = (req, res, next) => {
  if (!req.user) {
    next(new Error("token not valid"));
  } else {
    res.json({ user: req.user });
  }
};

module.exports = {
  stress_post,
  stress_result_get,
  stress_comment_get,
  checkToken,
};