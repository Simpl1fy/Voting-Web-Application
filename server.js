const express = require('express');
const app = express();
require("dotenv").config;

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send("Hello World");
})

app.listen(PORT, () => {
	console.log("Listening to port 3000, and server is online");
})