'use strict';

// bring in the express libraray
// don't forget to do an npm install express

const express = require('express');

//allows us to access our env variables
require('dotenv').config();

//access to weather.json
// require('./weather.json').config();

//allow our front-end to access our server
const cors = require('cors');

// initalizing the express library so I can use it
const app = express();

const weather = require('./weather.json');

//this allows anyone to access our server - aka - the worlds worst body guard
app.use(cors());


const PORT = process.env.PORT || 3001;
app.get('/', function (request, response) {
  response.send('Hello World');
});


app.get('/weather', forecastData);

function forecastData(request, response) {
  const city = weather.city_name;
  const lat = weather.lat;
  const lon = weather.lon;
  try {
    let array = weather.data.map(day => {
      return new Forecast(day);
    });
    const results = {
      city: city,
      lat: lat,
      lon: lon,
      forecast: array
    };
    response.status(200).json(results);
  } catch (error) {
    response.status(500).send('server error');
  }
}


function Forecast(obj) {
  this.description = obj.weather.description;
  this.date = obj.datetime;
}

// turn on the server
app.listen(PORT, () => console.log(`listening on ${PORT}`));


// three ways to do it:
// 1. node server.js
// 2. npm start
// 3. nodemon - this is going to check for changes and update