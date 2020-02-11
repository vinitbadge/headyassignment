
const bcrypt = require("bcryptjs");
const { User, validate } = require("../models/user_model");
const { Category, validateCat } = require("../models/category_model");
const { Product, validateProd } = require("../models/product_model");


module.exports.getUsers = async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
};

module.exports.createUser = async (req, res) => {
    // validate the request body first
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //find an existing user
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send({ errMsg: "User already registered." });

    user = new User({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        user_type: req.body.user_type
    });
    user.password = await bcrypt.hash(user.password, 10);
    const token = user.generateAuthToken();
    user.auth_token = token
    await user.save();


    res.header("x-auth-token", token).send({
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            auth_token: token
        }
    });


};

module.exports.userLogin = async (req, res) => {
    const user = await User.find({ email: req.body.email })/* .select("-password") */;
    if (user.length) {
        var hashedPassword = user[0].password
        var comparePassword = bcrypt.compareSync(req.body.password, hashedPassword);
        if (comparePassword) {
            res.send({ data: user });
        } else {
            res.send({ data: [], errMsg: "Invalid credentials" });
        }

    } else {
        res.send({ data: [], errMsg: "no user found" });
    }

};

module.exports.createCategory = async (req, res) => {
    // console.log(req.body)
    const { error } = validateCat(req.body);
    //console.log(error); console.log("hereeeee")
    if (error) return res.status(400).send({ errMsg: error.details[0].message });

    //find an existing user
    let category = await Category.findOne({ name: req.body.name/* , user_id: req.user._id  */ });
    if (category) return res.status(400).send({ errMsg: "Category already Exists." });

    category = new Category({
        name: req.body.name,
        user_id: req.user._id,

    });
    if (typeof req.body.parent_id != typeof undefined) {
        category.parent_id = req.body.parent_id
    }
    if (req.user.user_type == "Admin") {
        categoryData = await category.save();
        res.send({
            data: categoryData,
            message: "Category created successfully"
        });
    } else if (req.user.user_type == "Supervisor" && req.body.is_root == "N") {
        categoryData = await category.save();
        res.send({
            data: categoryData,
            message: "Category created successfully"
        });
    } else {
        res.send({
            errMsg: "Only admin allowed to create root category"
        });
    }

};

module.exports.createProduct = async (req, res) => {
    // console.log(req.body)
    const { error } = validateProd(req.body);
    //console.log(error); console.log("hereeeee")
    if (error) return res.status(400).send({ errMsg: error.details[0].message });

    //find an existing user
    let product = await Product.findOne({ name: req.body.name/* , user_id: req.user._id */ });
    if (product) return res.status(400).send({ errMsg: "Product already Exists." });

    product = new Product({
        name: req.body.name,
        price: req.body.price,
        qty: req.body.qty,
        user_id: req.user._id,
        category_id: req.body.category_id,
    });

    if (req.user.user_type == "Supervisor") {
        productData = await product.save();
        res.send({
            data: productData,
            message: "Product created successfully"
        });
    } else {
        res.send({
            errMsg: "Only supervisor allowed to create product"
        });
    }

};

module.exports.getCategories = async (req, res) => {
    var data = await Category.find().select("-__v");;
    data = JSON.parse(JSON.stringify(data));
    if (data.length) {
        var categories = data
        for (var i in data) {
            var childRecord = await this.getChild(data[i]._id, categories)
            if (childRecord.length) {
                if (typeof data[i].children == typeof undefined) {
                    data[i].children = childRecord
                }

            }

        }
        for (var i in data) {
            if (data[i].parent_id.length) {
                delete data[i]
            } else {
                var categories = data[i]
            }
        }

        res.send({ data: categories });
    } else {
        res.send({
            data: [],
            message: "no categories found"
        });
    }

};

module.exports.getChild = async (parentId, data) => {
    // console.log(parentId)
    // console.log(data)
    var childs = []
    for (var i in data) {
        //console.log(data[i].parent_id.includes(parentId))
        if (data[i].parent_id.includes(parentId)) {
            childs.push(data[i])
            //delete data[i]
        }

    }
    return childs

};

module.exports.getProducts = async (req, res) => {
    // console.log({ category_id: req.params.category_id })
    var data = await Product.find({ category_id: req.params.category_id }).select("-__v");;
    data = JSON.parse(JSON.stringify(data));
    if (data.length) {

        res.send({ data: data });
    } else {
        res.send({
            data: [],
            message: "no products found"
        });
    }

};

module.exports.updateCategory = async (req, res) => {
    // console.log(req.body)
    //const { error } = validateProd(req.body);
    //console.log(error); console.log("hereeeee")
    //if (error) return res.status(400).send({ errMsg: error.details[0].message });

    //find an existing user
    console.log(req.params)
    let product = await Product.find({ _id: req.params.product_id });
    console.log(product)
    if (product.length) {
        if (req.user.user_type == "Supervisor") {
            productData = await Product.update({ "_id": req.params.product_id }, { $set: req.body })
            res.send({
                data: productData,
                message: "Product update successfully"
            });
        } else {
            res.send({
                errMsg: "Only supervisor allowed to update product"
            });
        }
    } else {
        res.send({
            data: [],
            message: "no products found"
        });
    }



};



