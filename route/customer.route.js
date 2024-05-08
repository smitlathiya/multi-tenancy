const express = require('express');
const { addCustomer, getCustomer } = require('../controller/customer.controller');
const route = express.Router();

route.post("/add", addCustomer);
route.get("/get", getCustomer);

module.exports = route;