// app.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
require("dotenv").config();


const message = (req, res) => {
    res.status(200).json({ message: "Hello World!" });
};

app.get("/", message);

module.exports = app;
