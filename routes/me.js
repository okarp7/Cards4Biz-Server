const express = require("express");
const router = express.Router();
const _ = require("lodash");
const auth = require("../middlewares/auth");
const User = require("../models/user");

router.get("/", auth, async (req, res) => {
    try {
        let user = await User.findById(req.payload._id);
        if (!user) return res.status(404).send("No such user");
        res.status(200).send(_.pick(user, ["_id", "name", "email", "isBusiness", "image"]));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/isBusiness", auth, async (req, res) => {
    try {
        let user = await User.findById(req.payload._id);
        if (!user) return res.status(404).send("No such user");

        console.log(_.pick(user, ["isBusiness"]));
        res.status(200).send(_.pick(user, ["isBusiness"]));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/name", auth, async (req, res) => {
    try {
        let user = await User.findById(req.payload._id);
        if (!user) return res.status(404).send("No such user");

        res.status(200).send(_.pick(user, ["name"]));
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;