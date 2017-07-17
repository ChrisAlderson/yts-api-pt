'use strict'

const YTS = require('../yts-api-pt')

const yts = new YTS({
  debug: false
})

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
}).then(res => console.log(res))
  .catch(err => console.error(err))

yts.getMovie({
  movieId: 15,
  withImages: true,
  withCast: true
}).then(res => console.log(res))
  .catch(err => console.error(err))

yts.getSuggestions(15)
  .then(res => console.log(res))
  .catch(err => console.error(err))

yts.getParentalGuides(15)
  .then(res => console.log(res))
  .catch(err => console.error(err))
