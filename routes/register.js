const express = require('express');
const joi = require('joi');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Cart = require('../models/cart');


const registerSchema = joi.object().keys({
    name: joi.string().required().min(2),
    email: joi.string().email().required().min(2),
    password: joi.string().required().min(8),
    isBusiness: joi.boolean().required(),
});


router.post('/', async (req, res) => {
    try {
        //joi validation
        const { error } = registerSchema.validate(req.body);
        if (error) return res.status(400).send("Bad Request" + error);

        //check if user already exist
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send("User already exist");

        //encrtypt password and add to database
        user = new User(req.body);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        await user.save();

        //create token
        const token = JWT.sign({ _id: user._id, isBusiness: user.isBusiness }, process.env.JWT_Key);
        res.status(200).send(token);
    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports = router;
