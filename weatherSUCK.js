'use strict';

const superagent = require('superagent');

let cache = require('./cache.js');

function forecastData(request, response) {
  const city = request.query.city_name;
  const url = 'http://api.weatherbit.io/v2.0/forecast/daily';
  const query = {
    city: city,
    key: process.env.WEATHER_API_KEY,
  };

  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Cache hit');
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = superagent.get(url)
    .then(response => parseWeather(response.body));
  }
  
  return cache[key].data;
}

function parseWeather(weatherData) {
  try {
    const weatherArray = weatherData.data.map(day => {
      return new Forecast(day);
    });
    return Promise.resolve(weatherArray);
  } catch (e) {
    return Promise.reject(e);
  }
}

function Forecast(obj) {
  this.highTemp = `High Temp: ${obj.high_temp}`;
  this.lowTemp = `Low Temp: ${obj.low_temp}`;
  this.description = `Conditions: ${obj.weather.description}`;
  this.date = obj.datetime;
}

module.exports = forecastData;
