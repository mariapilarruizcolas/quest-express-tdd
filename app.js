// app.js
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const connection = require('./connection');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
require("dotenv").config();
const message = (req, res) => {
    res.status(200).json({ message: "Hello World!" });
};
app.get("/", message);
app.get("/", (req, res) => {
    res.send("Welcome to Express");
});



app.post('/bookmarks', (req, res) => {
    const { url, title } = req.body;
    //si l'un des champs url ou title manque dans le corps de requête.
    //de renvoyer le code de statut et le JSON d'erreur,
    if (!url || !title) {
        return res.status(422).json({ error: 'required field(s) missing' });
    }

    connection.query('INSERT INTO bookmark SET ?', req.body, (err, stats) => {
        if (err) return res.status(500).json({ error: err.message, sql: err.sql });

        connection.query('SELECT * FROM bookmark WHERE id = ?', stats.insertId, (err, records) => {
            if (err) return res.status(500).json({ error: err.message, sql: err.sql });
            return res.status(201).json(records[0]);
        });
    });
})
app.get("/api/users/:id", (req, res) => {
    const { id } = req.params;
    //si id n'existe pas doit renvoyer le code de statut et le JSON d'erreur,
    if (!id) {
        return res.send("Welcome to Express");
    }

    connection.query('SELECT * FROM bookmark where id= ?', req.params, (err, stats) => {
        if (err) return res.status(500).json({ error: 'Bookmark not found' });
        return res.status(201).json(stats[id]);
    });
});


module.exports = app;
