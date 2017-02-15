'use strict';

const YTS = require('../yts-api-pt');

const yts = new YTS({
  debug: false
});

yts.getMovies({
  limit: 20,
  page: 1,
  quality: 'All',
  minimum_rating: 0,
  query_term: 'inception',
  genre: 'action',
  sort_by: 'date_added',
  order_by: 'desc',
  with_rt_ratings: true
}).then(res => console.log(res))
  .catch(err => console.error(err));

yts.getMovie({
  movie_id: 15,
  with_images: true,
  with_cast: true
}).then(res => console.log(res))
  .catch(err => console.error(err));

yts.getSuggestions(15)
  .then(res => console.log(res))
  .catch(err => console.error(err));

yts.getParentalGuides(15)
  .then(res => console.log(res))
  .catch(err => console.error(err));
