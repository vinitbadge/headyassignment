
const config = require("config");;
const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

//simple schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    user_type: {
        type: String,
        require: [true, "."],
        trim: true,
        default: "Admin",
        enum: ['Admin', 'Supervisor']
    },
    auth_token: {
        type: String,
        require: [true, "."]
    }
});


//custom method to generate authToken 
UserSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, user_type: this.user_type }, config.get('myprivatekey')); //get the private key from the config file -> environment variable
    return token;
}

const User = mongoose.model('User', UserSchema);

//function to validate user 
function validateUser(user) {
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(3).max(255).required(),
        user_type: Joi.string().required().valid('Admin', 'Supervisor'),
    };

    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;