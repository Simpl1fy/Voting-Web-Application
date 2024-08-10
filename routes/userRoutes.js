const express = require('express');
const router = express.Router();

// importing the model schema
const User = require('./../models/user');

const {jwtAuthMiddleware, generateToken} = require('./../jwt');

// creating user signup route
router.post('/signup', async(req, res) => {
    try {
        const data = req.body;
        const newUser = new User(data);
        const response = await newUser.save();

        console.log("Data has been saved!");
        // creating a jwt token using payload
        const payload = {
            object_id: response.id
        }

        const token = generateToken(payload);
        console.log("Token has been generated = " + token);

        res.status(200).json({response: response, token: token});
    } catch(err) {
        console.log("Error Occured: " + err);
        res.status(500).json({"Error": "Internal Server Error"});
    }
})


module.exports = router;