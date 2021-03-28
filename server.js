'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3002;

const weatherHandler = require(`./weather`);
const movies = require(`./movies`);

app.use(cors());

app.get('/', function (request, response) {
  response.send('Hello World');
});

app.get('/weather', weatherHandler);
app.get('/movies', movies);





app.listen(PORT, () => console.log(`Listening on ${PORT}`));

