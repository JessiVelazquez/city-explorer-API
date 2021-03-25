'use strict';

//Libraries
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3002;

//Functions
const weather = require(`./weather`);

//Cors - Server Access to All
app.use(cors());

//Route - Proof of Life
app.get('/', function (request, response) {
  response.send('Hello World');
});

//Route - App
app.get('/weather', weather);

// turn on the server
app.listen(PORT, () => console.log(`listening on ${PORT}`));

