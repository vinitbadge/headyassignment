
const Joi = require('joi');
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

//simple schema
const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    price: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    user_id: {
        type: ObjectId,
        require: true,
        ref: "User",
        auto: true
    },
    category_id: [{
        type: ObjectId,
        require: false,
        ref: "Product",
        auto: true
    }]
});




const Product = mongoose.model('Product', ProductSchema);

//function to validate product 
function validateProduct(product) {
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        price: Joi.string().required(),
        category_id: Joi.array().required(),
        qty: Joi.number().required(),
    };

    return Joi.validate(product, schema);
}

exports.Product = Product;
exports.validateProd = validateProduct;