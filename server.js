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

const superagent = require('superagent');

//this allows anyone to access our server - aka - the worlds worst body guard
app.use(cors());


const PORT = process.env.PORT || 3002;
app.get('/', function (request, response) {
  response.send('Hello World');
});


app.get('/weather', forecastData);

function forecastData(request, response) {
  console.log(request.query);
  const city = request.query.city_name;
  const url = 'http://api.weatherbit.io/v2.0/forecast/daily';
  const query = {
    city: city,
    key: process.env.WEATHER_API_KEY,
  };

  superagent
    .get(url)
    .query(query)
    .then(superagentResults => {
      const weatherArray = superagentResults.body.data.map(agent => {
        console.log(agent);
        return new Forecast(agent);
      });
      console.log(weatherArray);
      response.status(200).send(weatherArray);
    })
    .catch(err => {
      response.status(500).send(err.message)
    });



  // ----------------------------
  // try {
  //   let array = weather.data.map(day => {
  //     return new Forecast(day);
  //   });
  //   const results = {
  //     city: city,
  //     lat: lat,
  //     lon: lon,
  //     forecast: array
  //   };
  //   response.status(200).json(results);
  // } catch (error) {
  //   response.status(500).send('server error');
  // }
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