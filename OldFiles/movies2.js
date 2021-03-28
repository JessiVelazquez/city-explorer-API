'use strict';

let cache = require('./cache.js');

//Libraries
const superagent = require('superagent');

//Functions
function getMovie(city) {
  console.log('city', city);
  const key = `movie-${city}`;
  console.log('key', key);
  const url = 'https://api.themoviedb.org/3/search/movie';
  const query = {
    query: city,
    api_key: process.env.MOVIES_API_KEY
  };

  if (cache[key] && (Date.now() - cache[key].timestamp < 300000)) {
    console.log('Cache hit', cache[key].data);
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();


    cache[key].data = superagent.get(url)
      .query(query)
      .then(response => parseMovies(response.body));
  }
  return cache[key].data;
}


function movieHandler(request, response) {
  const { city } = request.query;
  getMovie(city)
    .then(summaries => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(500).send('Sorry. Something went wrong!');
    });
}

function parseMovies(movieData) {
  try {
    const movieArray = movieData.data.map(day => {
      return new Movie(day);
    });
    return Promise.resolve(movieArray);
  } catch (e) {
    return Promise.reject(e);
  }
}

//Object constructor for front end
class Movie {
  constructor(obj) {
    this.title = `Title: ${obj.title}`;
    this.popularity = `Popularity: ${obj.popularity}`;
    this.overview = `Overview: ${obj.overview}`;
  }
}

//Exports
module.exports = movieHandler;
