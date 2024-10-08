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

router.post('/login', async (req, res) => {
    
    try {
        const {adharCardNumber, password} = req.body;
        console.log("Adhar Card Number:" + adharCardNumber);
        console.log('Password: ' + password);
        // finding the user in the collection using the adhar card number
        const user = await User.findOne({adharCardNumber: adharCardNumber});
        console.log(user);
        // console.log(JSON.stringify(user));

        // checking if the username and password are valid or not
        if (!user) {
            return res.status(401).json({Error: "Invaid Adhar Card Number"});
        }
        console.log("User has been found!");

        if(!(await user.comparePassword(password))) {
            return res.status(401).json({error: "invalid password"});
        }

        // payload to generate token
        const payload = {
            object_id: user.id
        };
        // if both info valid, then we generate tokens
        const token = generateToken(payload);
        console.log("Token has been generated" + token);

        res.status(200).json({user: user, token: token});
    } catch(err) {
        console.log(err);
        res.status(500).json({"error": "internal server error"});
    }
})

router.get('/profile', jwtAuthMiddleware, async(req, res) => {
    try {
        const user = req.jwtPayload;

        const userId = user.object_id;
        const response = await User.findById(userId)
        console.log("User Data has been fetched by token");
        res.status(200).json({Response: response});
    } catch(err) {
        console.log(err);
        res.status(500).json({Error: 'Internal Server Error'})
    }
})

router.put('/profile/password', jwtAuthMiddleware, async(req, res) => {
    try {
        const userId = req.jwtPayload.object_id;
        const {currentPassword, newPassword} = req.body;

        const user = await User.findById(userId);
        if(!(await user.comparePassword(currentPassword))) {
            return res.status(401).json({error: "Wrong Password"});
        }
        user.password = newPassword;
        await user.save;

        console.log("Password Updated");
        res.status(200).json({message: "Password Updated"});
    } catch(err) {
        console.log(err);
        res.status(500).json({Error: "Internal Server Error"});
    }
})

module.exports = router;