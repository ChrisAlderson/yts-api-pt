'use strict'

// Import the necessary modules.
const YtsApi = require('../yts-api-pt')

// Create a new instance of the module.
const yts = new YtsApi()

// Define a variable `movieId` for the example.
let movieId

// Get a list of movies.
yts.getMovies({
  limit: 20,
  page: 1,
  quality: 'All',
  minimumRating: 0,
  queryTerm: 'inception',
  genre: 'action',
  sortBy: 'date_added',
  orderBy: 'desc',
  withRtRatings: true
}).then(res => {
  console.log(res)

  // Set the moveId.
  movieId = res.data.movies[0].id

  // Get a single movie.
  return yts.getMovie({
    movieId,
    withImages: true,
    withCast: true
  })
}).then(res => {
  console.log(res)

  // Get the suggestions of a movie.
  return yts.getSuggestions(movieId)
}).then(res => {
  console.log(res)

  // Get the parental guides of a movie.
  return yts.getParentalGuides(movieId)
}).then(res => console.log(res))
  .catch(err => console.error(err))
