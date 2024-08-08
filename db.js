const mongoose = require('mongoose');
require("dotenv").config();

const mongoUrl = process.env.DB_URL_LOCAL;

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("connected", () => {
    console.log("Connected to mongo database");
})

db.on("error", (err)=> {
    console.log("There was a error: " + err);
})

db.on("disconnected", () => {
    console.log("Disconnected from the server");
})

module.exports = db;