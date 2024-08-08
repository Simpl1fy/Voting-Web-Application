const express = require('express');
const router = express.Router();

// importing the model schema
const User = require('./../models/user');

// creating user signup route
router.post('/signup', async(req, res) => {
    try {
        const data = req.body;
        const newUser = new User(data);
        const response = await newUser.save();

        console.log("Data has been saved!");
        res.status(200).json({response: response});
    } catch(err) {
        console.log("Error Occured: " + err);
        res.status(500).json({"Error": "Internal Server Error"});
    }
})


module.exports = router;