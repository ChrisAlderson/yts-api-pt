'use strict';

const { assert } = require('chai');

const YTS = require('../yts-api-pt');

describe('YTS.ag', () => {

  let yts;
  before(() => {
    yts = new YTS();
  });

  it('getMovies', done => {
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
    }).then(res => {
      assert.isObject(res);
      done();
    }).catch(err => done(err));
  });

  it('getMovie', done => {
    yts.getMovie({
      movie_id: 15,
      with_images: true,
      with_cast: true
    }).then(res => {
      assert.isObject(res);
      done();
    }).catch(err => done(err));
  });

  it('getSuggestions', done => {
    yts.getSuggestions(15).then(res => {
      assert.isObject(res);
      done();
    }).catch(err => done(err));
  });

  it('getParentalGuides', done => {
    yts.getParentalGuides(15).then(res => {
      assert.isObject(res);
      done();
    }).catch(err => done(err));
  });

});
