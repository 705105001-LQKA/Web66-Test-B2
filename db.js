const mongoose = require("mongoose");

mongoose.connect('mongodb://0.0.0.0:27017/test')

const productSchema = new mongoose.Schema({
  sku: String,
  description: String,
  instock: Number
});

const productModel = mongoose.model('products', productSchema)

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const userModel = mongoose.model('users', userSchema)

const orderSchema = new mongoose.Schema({
  item:  String,
  price: Number,
  quantity: Number
});

const orderModel = mongoose.model('orders', orderSchema);

module.exports = { productModel, userModel, orderModel };
