'use strict';

const request = require('request');

const defaultOptions = {
  baseUrl: 'https://yts.ag/api/v2/',
  timeout: 4 * 1000
};

module.exports = class YTS {

  constructor({options = defaultOptions, debug = false} = {}) {
    this._request = request.defaults(options);
    this._debug = debug;

    this._qualities = {
      'All': 'All',
      '720p': '720p',
      '1080p': '1080p',
      '3D': '3D'
    };
    this._sort_by = {
      title: 'title',
      year: 'year',
      rating: 'rating',
      peers: 'peers',
      seeds: 'seeds',
      download_count: 'download_count',
      like_count: 'like_count',
      date_added: 'date_added',
    };
    this._order_by = {
      desc: 'desc',
      asc: 'asc'
    };
  }

  _get(uri, qs, retry = true) {
    if (this._debug) console.warn(`Making request to '${uri}', qs: '${JSON.parse(qs)}'`);
    return new Promise((resolve, reject) => {
      return this._request.get({ uri, qs }, (err, res ,body) => {
        if (err && retry) {
          return resolve(this._get(uri, qs, false));
        } else if (err) {
          return reject(err);
        } else if (!body || res.statusCode >= 400) {
          return reject(new Error(`No data found on uri: '${uri}', qs: '${JSON.parse(qs)}', statuscode: ${res.statusCode}`));
        } else {
          return resolve(JSON.parse(body));
        }
      });
    });
  }

  getMovies({limit = 20, page = 1, quality = 'All', minimum_rating = 0, query_term, genre, sorty_by = 'date_added', order_by = 'desc', with_rt_ratings = false} = {}) {
    if (limit < 1 || limit > 50) throw new Error(`${limit} is not a valid value for limit!`);
    if (!this._qualities[quality]) throw new Error(`${quality} is not a valid value for quality!`);
    if (minimum_rating < 0 || minimum_rating > 9) throw new Error(`${minimum_rating} is not a valid value for minimum_rating`);
    if (!this._sort_by[sorty_by]) throw new Error(`${sorty_by} is not a valid value for sorty_by!`);
    if (!this._order_by[order_by]) throw new Error(`${order_by} is not a valid value for order_by!`);
    if (typeof(with_rt_ratings) !== 'boolean') throw new Error(`${with_rt_ratings} is not a valid value for with_rt_ratings!`);

    return this._get('list_movies.json', { limit, page, quality, minimum_rating, query_term, genre, sorty_by, order_by, with_rt_ratings });
  }

  getMovie({movie_id, with_images = false, with_cast = false} = {}) {
    if (!movie_id || typeof(movie_id) !== 'number') throw new Error(`${movie_id} is not a valid value for movie_id!`);
    if (typeof(with_images) !== 'boolean') throw new Error(`${with_images} is not a valid value for with_images!`);
    if (typeof(with_cast) !== 'boolean') throw new Error(`${with_cast} is not a valid value for with_cast!`);

    return this._get('movie_details.json', { movie_id, with_images, with_cast});
  }

  getSuggestions(movie_id) {
    if (!movie_id || typeof(movie_id) !== 'number') throw new Error(`${movie_id} is not a valid value for movie_id!`);
    return this._get('movie_suggestions.json', { movie_id });
  }

  getParentalGuides(movie_id) {
    if (!movie_id || typeof(movie_id) !== 'number') throw new Error(`${movie_id} is not a valid value for movie_id!`);
    return this._get('movie_parental_guides.json', { movie_id });
  }

}
