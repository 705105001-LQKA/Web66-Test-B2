const express = require("express");
const mongoose = require('mongoose');
const { productModel, userModel, orderModel } = require("./db");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());

const authenticationCheck = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, 'token@123');
  const { username } = decoded;
  const user = await userModel.findOne({ username: username });
  if (user) {
      req.user = user;
      next();
  } else {
      res.send('User khong ton tai');
  }
};

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const existringUser = await userModel.findOne({ username });
  if(existringUser){
      res.send("User da ton tai");
  } else {
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt); 
      const newUser = await userModel.create({ username, password: hashPassword });
      res.send(newUser);
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await userModel.findOne({ username }); 
  if(user && bcrypt.compare(password, user.password)){
      const token = jwt.sign({ username: username }, 'token@123');
      res.send({ token: token });
  } else {
      res.send("Ko thay user");
  }
});

app.get('/products/all', authenticationCheck, async (req, res) => {
    const products = await productModel.find({});
    res.send(products);
})

app.get('/products/low', authenticationCheck, async (req, res) => {
  const products = await productModel.find({
    instock: {$lte: 100},
  });
  res.send(products);
})

app.get('/products/order', authenticationCheck, async (req, res) => {
  const orders = await orderModel.find({});
  res.send(orders);
});

app.listen(3000, () => {
  console.log("App is running at 3000");
});

module.exports = app;
