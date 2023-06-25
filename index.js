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

app.post('/import', async (req, res) => {
  const orders = [{
    "_id": 1,
    "item": "almonds",
    "price": 12,
    "quantity": 2
  },
  {
    "_id": 2,
    "item": "pecans",
    "price": 20,
    "quantity": 1
  },
  {
    "_id": 3,
    "item": "pecans",
    "price": 20,
    "quantity": 3
  }];
  const products = [{
    "_id": 1,
    "sku": "almonds",
    "description": "product 1",
    "instock": 120
  },
  {
    "_id": 2,
    "sku": "bread",
    "description": "product 2",
    "instock": 80
  },
  {
    "_id": 3,
    "sku": "cashews",
    "description": "product 3",
    "instock": 60
  },
  {
    "_id": 4,
    "sku": "pecans",
    "description": "product 4",
    "instock": 70
  }];

  const users = [{
    "username": "admin",
    "password": "MindX@2022"
  },
  {
    "username": "alice",
    "password": "MindX@2022"
  }]

  userModel.insertMany(users);

  productModel.insertMany(products);

  orderModel.insertMany(orders);
});

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
