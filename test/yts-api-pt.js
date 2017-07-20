'use strict'

/* eslint-disable no-unused-expressions */
// Import the necessary modules.
const { expect } = require('chai')
const YtsApi = require('../yts-api-pt')

/** @test {YtsApi} */
describe('YtsApi', () => {
  /**
   * The YtsApi instance.
   * @type {YtsApi}
   */
  let yts

  /**
   * Hook for setting up the YtsApi tests.
   * @type {Function}
   */
  before(() => {
    // Disable the warn logging function to testing.
    console.warn = () => {}
    yts = new YtsApi({
      debug: true
    })
  })

  /**
   * Test the status attributes.
   * @param {Object} res - The status to test.
   * @return {undefined}
   */
  function testStatusAttributes(res) {
    expect(res.status).to.be.a('string')
    expect(res.status).to.equal('ok')
    expect(res.status_message).to.be.a('string')
    expect(res.status_message).to.equal('Query was successful')
  }

  /**
   * Test the meta attributes.
   * @param {Object} res - The meta to test.
   * @return {undefined}
   */
  function testMetaAttributes(meta) {
    expect(meta.server_time).to.be.a('number')
    expect(meta.server_timezone).to.be.a('string')
    expect(meta.api_version).to.be.a('number')
    expect(meta.api_version).to.equal(2)
    expect(meta.execution_time).to.be.a('string')
  }

  /**
   * Test the result of the `getMovies` method.
   * @param {Object} res - The result of a `getMovies` method call.
   * @returns {undefined}
   */
  function testGetMoviesResult(res) {
    expect(res).to.be.an('object')
    testStatusAttributes(res)

    const { data } = res
    expect(data).to.be.an('object')
    expect(data.movie_count).to.be.a('number')
    expect(data.movie_count).to.be.at.least(1)
    expect(data.limit).to.be.a('number')
    expect(data.limit).to.equal(20)
    expect(data.page_number).to.be.a('number')
    expect(data.page_number).to.be.at.least(1)
    expect(data.movies).to.be.an('array')
    expect(data.movies.length).to.be.at.least(1)

    const random = Math.floor(Math.random() * data.movies.length)
    expect(data.movies[random]).to.be.an('object')

    const meta = res['@meta']
    testMetaAttributes(meta)
  }

  /** @test {YtsApi#getMovies} */
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
      testGetMoviesResult(res)
      return yts.getMovies()
    }).then(res => {
      testGetMoviesResult(res)
      done()
    }).catch(done)
  })

  /** @test {YtsApi#getMovies} */
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

  /** @test {YtsApi#getMovie} */
  it('should get a movie with images and cast', done => {
    yts = new YtsApi()
    yts.getMovie({
      movieId: 15,
      withImages: true,
      withCast: true
    }).then(res => {
      expect(res).to.be.an('object')
      testStatusAttributes(res)

      const { data } = res
      expect(data).to.be.an('object')
      expect(data.movie).to.be.an('object')

      const meta = res['@meta']
      testMetaAttributes(meta)

      done()
    }).catch(done)
  })

  /** @test {YtsApi#getMovie} */
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

  /** @test {YtsApi#getSuggestions} */
  it('should get the suggestions of a movie', done => {
    yts.getSuggestions(15).then(res => {
      expect(res).to.be.an('object')
      testStatusAttributes(res)

      const { data } = res
      expect(data).to.be.an('object')
      expect(data.movie_count).to.be.a('number')
      expect(data.movies).to.be.an('array')
      expect(data.movies.length).to.be.at.least(1)

      const meta = res['@meta']
      testMetaAttributes(meta)

      done()
    }).catch(done)
  })

  /** @test {YtsApi#getSuggestions} */
  it('should throw an error when getting the suggestions of a movie', () => {
    expect(yts.getSuggestions).to.throw('is not a valid value for movieId!')
  })

  /** @test {YtsApi#getParentalGuides} */
  it('should get the parental guide of a movie', done => {
    yts.getParentalGuides(15).then(res => {
      expect(res).to.be.an('object')
      testStatusAttributes(res)

      const { data } = res
      expect(data).to.be.an('object')
      expect(data.parental_guide_count).to.be.a('number')
      expect(data.parental_guides).to.be.an('array')
      expect(data.parental_guides.length).to.be.at.least(1)

      const meta = res['@meta']
      testMetaAttributes(meta)

      done()
    }).catch(done)
  })

  /** @test {YtsApi#getParentalGuides} */
  it('should throw an error when getting the parental guide of a movie', () => {
    expect(yts.getParentalGuides).to.throw('is not a valid value for movieId!')
  })
})
