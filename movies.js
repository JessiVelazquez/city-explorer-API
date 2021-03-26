'use strict';

//Libraries
const superagent = require('superagent');

//Functions
function movieData(request, response) {
  const city = request.query.city;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIES_API_KEY}&query=${city}`;

  superagent
    .get(url)
    .then(superagentResults => {
      const movieArray = superagentResults.body.results.map(agent => {
        return new Movie(agent);
      });
      console.log('mov', movieArray);
      response.status(200).send(movieArray);
    })
    .catch(err => {
      response.status(500).send(err.message);
    });
}

//Object constructor for front end
function Movie(obj) {
  this.title = `Title: ${obj.title}`;
  this.popularity = `Popularity: ${obj.popularity}`;
  this.overview = `Overview: ${obj.overview}`;
}


//Exports
module.exports = movieData;
