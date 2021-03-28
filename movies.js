'use strict';

//Libraries
const superagent = require('superagent');

const inMemoryDB = {};

//Functions
function getMovies(request, response) {
  const { city } = request.query;

  if(inMemoryDB[city] !== undefined && inMemoryDB[city].createdAt > Date.now() - 300000) {
    console.log('getting info from the database');
    response.status(200).send(inMemoryDB[city]);
  } else {
    inMemoryDB[city] = undefined;
    const url = 'https://api.themoviedb.org/3/search/movie';
    const query = {
      query: city,
      api_key: process.env.MOVIES_API_KEY
    };
    console.log('query', query);

    superagent
      .get(url)
      .query(query)
      .then(superagentResults => {
        const movieArray = superagentResults.body.results.map(agent => {
          return new Movie(agent);
        });
        inMemoryDB[city] = movieArray;
        response.status(200).send(movieArray);
      })
      .catch((err) => {
        console.error('superagent error', err.url);
      });
  }

}

//Object constructor for front end
function Movie(obj) {
  this.title = `Title: ${obj.title}`;
  this.popularity = `Popularity: ${obj.popularity}`;
  this.overview = `Overview: ${obj.overview}`;
}


//Exports
module.exports = getMovies;

