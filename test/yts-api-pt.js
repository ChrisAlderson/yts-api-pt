'use strict'

const { assert, expect } = require('chai')

const YTS = require('../yts-api-pt')

describe('YTS.ag', () => {

  let yts

  before(() => {
    console.warn = () => {}
    yts = new YTS({
      debug: true
    })
  })

  it('should get multiple movies', done => {
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
      // TODO: replace with `expect`.
      assert.isObject(res)

      done()
    }).catch(done)
  })

  it('should throw an error when getting movies', () => {
    expect(yts.getMovies.bind(yts.getMovies, {
      limit: -1
    })).to.throw('-1 is not a valid value for limit!')
    expect(yts.getMovies.bind(yts.getMovies, {
      limit: 51
    })).to.throw('51 is not a valid value for limit!')
    expect(yts.getMovies.bind(yts.getMovies, {
      quality: 'failing'
    })).to.throw('failing is not a valid value for quality!')
    expect(yts.getMovies.bind(yts.getMovies, {
      minimumRating: -1
    })).to.throw('-1 is not a valid value for minimumRating!')
    expect(yts.getMovies.bind(yts.getMovies, {
      minimumRating: 10
    })).to.throw('10 is not a valid value for minimumRating!')
    expect(yts.getMovies.bind(yts.getMovies, {
      sortyBy: 'failing'
    })).to.throw('failing is not a valid value for sortyBy!')
    expect(yts.getMovies.bind(yts.getMovies, {
      orderBy: 'failing'
    })).to.throw('failing is not a valid value for orderBy!')
    expect(yts.getMovies.bind(yts.getMovies, {
      withRtRatings: 'failing'
    })).to.throw('failing is not a valid value for withRtRatings!')
  })

  it('should get a movie with images and cast', done => {
    yts.getMovie({
      movieId: 15,
      withImages: true,
      withCast: true
    }).then(res => {
      // TODO: replace with `expect`.
      assert.isObject(res)

      done()
    }).catch(done)
  })

  it('should throw an error when getting a movie', () => {
    expect(yts.getMovie.bind(yts.getMovie, {
      movieId: 'failing'
    })).to.throw('failing is not a valid value for movieId!')
    expect(yts.getMovie.bind(yts.getMovie, {
      movieId: 15,
      withImages: 'failing'
    })).to.throw('failing is not a valid value for withImages!')
    expect(yts.getMovie.bind(yts.getMovie, {
      movieId: 15,
      withImages: true,
      withCast: 'failing'
    })).to.throw('failing is not a valid value for withCast!')
  })

  it('should get the suggestions of a movie', done => {
    yts.getSuggestions(15).then(res => {
      // TODO: replace with `expect`.
      assert.isObject(res)

      done()
    }).catch(done)
  })

  it('should throw an error when getting the suggestions of a movie', () => {
    expect(yts.getSuggestions).to.throw('is not a valid value for movieId!')
  })

  it('should get the parental guide of a movie', done => {
    yts.getParentalGuides(15).then(res => {
      // TODO: replace with `expect`.
      assert.isObject(res)

      done()
    }).catch(done)
  })

  it('should throw an error when getting the parental guide of a movie', () => {
    expect(yts.getParentalGuides).to.throw('is not a valid value for movieId!')
  })

})
