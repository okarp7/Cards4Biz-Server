const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();
const joi = require('joi');
const Product = require('../models/Card');
const Cart = require('../models/cart');
const _ = require("lodash");


const cardSchema = new joi.object({
    companyName: joi.string().required().min(2),
    companyEmail: joi.string().email().required().min(2),
    image: joi.string().required(),
    imageBGC: joi.string().optional().allow(null, ''),
    description: joi.string().required().min(5),
    address: joi.string().required().min(5),
    phone: joi.string().required().min(7),
    // userId: joi.string().required(),
})
router.get("/", auth, async (req, res) => {
    let allcard = await Card.find({});
    res.status(200).send(allcard);
});

router.get("/user", auth, async (req, res) => {

    let userId = req.payload._id
    let allcardForUser = await Card.find({ userId });
    res.status(200).send(allcardForUser);
});

router.get("/:id", auth, async (req, res) => {
    try {
        let allcardForUser = await Card.find({ _id: req.params.id, userId: req.payload._id });
        console.log(allcardForUser);
        if (allcardForUser.length == 0) { return res.status(400).send("Access denied. Card not found"); }
        res.status(200).send(allcardForUser);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

router.put("/:id", auth, async (req, res) => {

    try {
        // check if user is admin -- with payload
        if (!req.payload.isBusiness)
            return res.status(400).send("Access denied. No Business permission");
        // joi validate
        let { error } = cardSchema.validate(req.body);
        if (error) return res.status(400).send("Data Problem");
        // add card to db
        let { name, email, description, image, address, phone } = req.body;
        // console.log("5555");
        console.log(companyEmail);

        Card.findOneAndUpdate({ id: req.params.id }, { name, email, description, image, address, phone }, { upsert: true, new: true })

        let update = await Card.findOneAndUpdate({ _id: req.params.id }, { name, email, description, image, address, phone }, { returnOriginal: false });
        await update.save();
        res.status(200).send("Update")

            ;
    } catch (error) {
        console.log(error);
        res.status(400).send("Data Problem");
    }
});

router.post("/", auth, async (req, res) => {
    console.log(req.body);
    try {
        if (!req.payload.isBusiness)
            return res.status(400).send("Access denied. No Business permission");
        // joi validate
        let { error } = cardSchema.validate(req.body);
        console.log(error);
        if (error) return res.status(400).send("Data Problem");
        // add card to db
        let card = new Card({ ...req.body, userId: req.payload._id, id: _.random(1, 10000) });
        await card.save();
        res.status(201).send(card);
    } catch (error) {
        res.status(400).send("Data Problem");
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        if (!req.payload.isBusiness)
            return res.status(400).send("Access denied. No Business permission");
        // delete card from db
        // await card.save();
        await Card.findOneAndDelete({ _id: req.params.id }, { upsert: true, new: true })
        res.status(201).send("card Deleted");
    } catch (error) {
        console.log(error);
        res.status(400).send("we have a Problem....");
    }
})

module.exports = router;