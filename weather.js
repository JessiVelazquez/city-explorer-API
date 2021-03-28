'use strict';

let cache = require('./cache.js');

const superagent = require('superagent');


function getWeather(lat, lon) {
  // console.log('latlon', lat, lon);
  const key = `weather-${lat}-${lon}`;
  const url = 'http://api.weatherbit.io/v2.0/forecast/daily';
  const query = {
    key: process.env.WEATHER_API_KEY,
    lat: lat,
    lon: lon
  };

  if (cache[key] && (Date.now() - cache[key].timestamp < 300000)) {
    // console.log('Cache hit', cache[key].data);
  } else {
    // console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();


    cache[key].data = superagent.get(url)
      .query(query)
      .then(response => parseWeather(response.body));
  }
  return cache[key].data;
}



function weatherHandler(request, response) {
  const { lat, lon } = request.query;
  // console.log('lat', lat);
  getWeather(lat, lon)
    .then(summaries => response.send(summaries))
    .catch((error) => {
      // console.error(error);
      response.status(500).send('Sorry. Something went wrong!');
    });
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

class Forecast {
  constructor(obj) {
    this.highTemp = `High Temp: ${obj.high_temp}`;
    this.lowTemp = `Low Temp: ${obj.low_temp}`;
    this.description = `Conditions: ${obj.weather.description}`;
    this.date = obj.datetime;
  }
}

module.exports = weatherHandler;
