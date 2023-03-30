const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const regsiter = require("./routes/register")
const login = require("./routes/login")
const me = require("./routes/me")
const products = require("./routes/products")
const carts = require("./routes/cards")
const cors = require("cors")
const app = express();


const port = process.env.PORT || 6000;

app.use(express.json());
app.use(cors());
app.use(logger);
app.use('/api/register', regsiter);
app.use('/api/login', login);
app.use('/api/me', me);
app.use('/api/products', products);
app.use('/api/carts', carts);

let loggerMiddleware = (req, res, next) => {
    console.log(`Method: ${req.method}, URL: ${req.url}`);
    next();
};

app.use(loggerMiddleware);


mongoose.connect(process.env.DB, { useNewUrlParser: true })
    .then(() => console.log("MongoDB connected"))
    .catch(() => console.log("MongoDB failed"));


app.listen(port, () => console.log(`Server started on port ${port}`));