'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3002;

const weather = require(`./weatherSUCK`);
// const movies = require(`./movies`);

app.use(cors());

app.get('/', function (request, response) {
  response.send('Hello World');
});

app.get('/weather', weatherHandler);
// app.get('/weather', moviesHandler)


function weatherHandler(request, response) {
  const { lat, lon } = request.query;
  weather(lat, lon)
    .then(summaries => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(200).send('Sorry. Something went wrong!');
    });
}

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

