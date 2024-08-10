const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    mobile: {
        type: String
    },
    email: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    adharCardNumber: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        defulat: 'voter'
    },
    isVoted: {
        type: Boolean,
        default: false
    }
});

userSchema.pre('save', async function(next) {
    const user = this;

    if (!user.isModified('password')) return next();
    try {
        // generating salt
        const salt = await bcrypt.genSalt(10);

        // generate hash password
        const hashPass = await bcrypt.hash(user.password, salt);
        user.password = hashPass;
        next();
    } catch (err) {
        return next(err);
    }
});

userSchema.methods.comparePassword = async function(givenPassword) {
    try {
        const isMatch = await bcrypt.compare(givenPassword, this.password);
    } catch(err) {
        throw(err);
    }
}


const User = mongoose.model('User', userSchema);
module.exports = User;