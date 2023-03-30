const mongoose = require("mongoose");

const cardsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2
    },
    email: {
        type: String,
        minlength: 2,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true,
        minlength: 5,
    },
    address: {
        type: String,
        required: true,
        minlength: 5,
    },
    phone: {
        type: String,
        required: true,
        minlength: 7,
    },
    image: {
        type: String,
        required: false
    },
    userId: {
        type: String,
        required: true,
    },
    id: {
        type: Number,
        required: true,
    },
});

const Card = mongoose.model("cards", cardsSchema);
module.exports = Card;
