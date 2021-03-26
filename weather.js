'use strict';

//Libraries
const superagent = require('superagent');

//Functions
function forecastData(request, response) {
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
        return new Forecast(agent);
      });
      response.status(200).send(weatherArray);
    })
    .catch(err => {
      response.status(500).send(err.message)
    });
}

//Object constructor for front end
function Forecast(obj) {
  this.highTemp = `High Temp: ${obj.high_temp}`;
  this.lowTemp = `Low Temp: ${obj.low_temp}`;
  this.description = `Conditions: ${obj.weather.description}`;
  this.date = obj.datetime;
}


//Exports
module.exports = forecastData;
