
const Joi = require('joi');
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

//simple schema
const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    user_id: {
        type: ObjectId,
        require: true,
        ref: "User",
        auto: true
    },
    parent_id: [{
        type: ObjectId,
        require: false,
        ref: "Category",
        auto: true
    }]
});




const Category = mongoose.model('Category', CategorySchema);

//function to validate category 
function validateCategory(category) {
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        // user_id: Joi.string().required(),
        is_root: Joi.string().valid('Y', 'N').required(),
        parent_id: Joi.string().when('is_root', { is: "N", then: Joi.string().required(), otherwise: Joi.string().optional() })

    };

    return Joi.validate(category, schema);
}

exports.Category = Category;
exports.validateCat = validateCategory;