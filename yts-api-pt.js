'use strict'

const got = require('got')
const querystring = require('querystring')

module.exports = class YTS {

  constructor({baseUrl = 'https://yts.ag/api/v2/', debug = false} = {}) {
    this._baseUrl = baseUrl
    this._debug = debug

    YTS._qualities = {
      'All': 'All',
      '720p': '720p',
      '1080p': '1080p',
      '3D': '3D'
    }
    YTS._sortBy = {
      title: 'title',
      year: 'year',
      rating: 'rating',
      peers: 'peers',
      seeds: 'seeds',
      download_count: 'download_count',
      like_count: 'like_count',
      date_added: 'date_added'
    }
    YTS._orderBy = {
      desc: 'desc',
      asc: 'asc'
    }
  }

  _get(uri, query = {}) {
    if (this._debug) {
      console.warn(`Making request to: '${uri}${querystring.stringify(query)}'`)
    }

    return got.get(`${this._baseUrl}/${uri}`, {
      query,
      json: true
    }).then(({body}) => body)
  }

  getMovies({
    limit = 20,
    page = 1,
    quality = 'All',
    minimumRating = 0,
    queryTerm,
    genre,
    sortyBy = 'date_added',
    orderBy = 'desc',
    withRtRatings = false
  } = {}) {
    if (limit < 1 || limit > 50) {
      throw new Error(`${limit} is not a valid value for limit!`)
    }

    if (!YTS._qualities[quality]) {
      throw new Error(`${quality} is not a valid value for quality!`)
    }

    if (minimumRating < 0 || minimumRating > 9) {
      throw new Error(`${minimumRating} is not a valid value for minimumRating!`)
    }

    if (!YTS._sortBy[sortyBy]) {
      throw new Error(`${sortyBy} is not a valid value for sortyBy!`)
    }

    if (!YTS._orderBy[orderBy]) {
      throw new Error(`${orderBy} is not a valid value for orderBy!`)
    }

    if (typeof withRtRatings !== 'boolean') {
      throw new Error(`${withRtRatings} is not a valid value for withRtRatings!`)
    }

    return this._get('list_movies.json', {
      limit,
      page,
      quality,
      minimum_rating: minimumRating,
      query_term: queryTerm,
      genre,
      sorty_by: sortyBy,
      order_by: orderBy,
      with_rt_ratings: withRtRatings
    })
  }

  getMovie({movieId, withImages = false, withCast = false} = {}) {
    if (!movieId || typeof movieId !== 'number') {
      throw new Error(`${movieId} is not a valid value for movieId!`)
    }

    if (typeof withImages !== 'boolean') {
      throw new Error(`${withImages} is not a valid value for withImages!`)
    }

    if (typeof withCast !== 'boolean') {
      throw new Error(`${withCast} is not a valid value for withCast!`)
    }

    return this._get('movie_details.json', {
      movie_id: movieId,
      with_images: withImages,
      with_cast: withCast
    })
  }

  getSuggestions(movieId) {
    if (!movieId || typeof movieId !== 'number') {
      throw new Error(`${movieId} is not a valid value for movieId!`)
    }

    return this._get('movie_suggestions.json', {
      movie_id: movieId
    })
  }

  getParentalGuides(movieId) {
    if (!movieId || typeof movieId !== 'number') {
      throw new Error(`${movieId} is not a valid value for movieId!`)
    }

    return this._get('movie_parental_guides.json', {
      movie_id: movieId
    })
  }

}
