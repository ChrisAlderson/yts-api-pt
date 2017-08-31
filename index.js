// Import the necessary modules.
const debug = require('debug')
const got = require('got')
const { stringify } = require('querystring')

const { name } = require('./package')

/**
 * A response object from yts.ag.
 * @typedef {Object} Response
 * @property {string} status The status of the response.
 * @property {string} status_message The status message of the response.
 * @property {Data} data The data of the response.
 * @property {Meta} @meta The metadata of the response.
 */

/**
 * The data object from yts.ag.
 * @typedef {Object} Data
 * @property {number} [movie_count] The movie count of the data.
 * @property {number} [limit] The limit of the data.
 * @property {number} [page_number] The page number of the data.
 * @property {Array<Movie>} [movies] The movies of the data
 * @property {Movie} [movie] The movie of the data
 * @property {number} [parental_guide_count] The parental guide count of the
 * data.
 * @property {Array<ParentalGuide>} [parental_guides] The parental guides of
 * the data.
 */

/**
 * A movie from yts.ag.
 * @typedef {Object} Movie
 * @property {number} id The id of the movie.
 * @property {string} url The url of the movie.
 * @property {string} imdb_code The imdb code fo the movie.
 * @property {string} title The title of the movie.
 * @property {string} title_english The english title of the movie.
 * @property {string} title_long The long title of the movie.
 * @property {string} slug The slug of the movie.
 * @property {number} year The year the movies was released.
 * @property {number} rating The rating of the movie.
 * @property {number} runtime The rumtime of the movie.
 * @property {Array<string>} genres The genres of the movie.
 * @property {string} summary The summary of the movie.
 * @property {string} description_full The full description of the movie.
 * @property {string} synopsis The synopsis of the movie.
 * @property {string} yt_trailer_code The YT trailer code of the movie.
 * @property {string} languagei The language of the movie.
 * @property {string} mpa_rating The MPA rating of the movie.
 * @property {string} background_image The background image of the movie.
 * @property {string} background_image_original The original background image
 * of the movie.
 * @property {string} small_cover_image The small image cover of the movie.
 * @property {string} medium_covder_image The medium image cover of the movie.
 * @property {string} large_cover_image The large image cover of the movie.
 * @property {string} state The state of the movie.
 * @property {Array<Torrent>} torrents The torrents of the movie.
 * @property {string} date_uploaded The date the movie was uploaded.
 * @property {number} date_uploaded_unix The date the movie was uploaded in
 * unix format.
 */

/**
 * A torrent from yts.ag.
 * @typedef {Object} Torrent
 * @property {string} url The url to the torrent.
 * @property {string} hash The hash of the torrent.
 * @property {string} quality The quality of the torrent.
 * @property {number} seeds The amount of seeds of the torrent.
 * @property {number} peers The amount of peers of the torrent.
 * @property {string} size The size of the torrent.
 * @property {number} size_bytes The size of the torrent in bytes.
 * @property {string} date_uploaded The data uploaded.
 * @property {number} date_uploaded_unix The date uploaded in unix time.
 */

/**
 * The meta object from yts.ag.
 * @typedef {Object} Meta
 * @property {number} server_time The server time of the api.
 * @property {string} server_timezone The server timezone of the api.
 * @property {number} api_version The api version.
 * @property {string} execution_time The execution time of the reponse.
 */

/**
 * The parental guide object from yts.ag
 * @typedef {Object} ParentalGuide
 * @property {string} type The type of the parental guide.
 * @property {string} parental_guide_text The parental guide text.
 */

/**
 * A NodeJS wrapper for yts.ag.
 * @type {YtsApi}
 */
module.exports = class YtsApi {

  /**
   * Create a new instance of the module.
   * @param {!Object} config={} - The configuration object for the module.
   * @param {!string} baseUrl=https://yts.ag/api/v2/ - The base url of yts.
   */
  constructor({baseUrl = 'https://yts.ag/api/v2/'} = {}) {
    /**
     * The base url of yts.
     * @type {string}
     */
    this._baseUrl = baseUrl
    /**
     * Show extra output.
     * @type {Function}
     */
    this._debug = debug(name)
    /**
     * The available qualities for movies.
     * @type Object
     */
    YtsApi._qualities = {
      'All': 'All',
      '720p': '720p',
      '1080p': '1080p',
      '3D': '3D'
    }
    /**
     * The available properties to sort by.
     * @type {Object}
     */
    YtsApi._sortBy = {
      title: 'title',
      year: 'year',
      rating: 'rating',
      peers: 'peers',
      seeds: 'seeds',
      download_count: 'download_count',
      like_count: 'like_count',
      date_added: 'date_added'
    }
    /**
     * The available ways to sort.
     * @type {Object}
     */
    YtsApi._orderBy = {
      desc: 'desc',
      asc: 'asc'
    }
  }

  /**
   * Make a get request to yts.ag
   * @param {!string} endpoint - The endpoint to make the request to.
   * @param {!Object} [query] - The querystring for the request.
   * @returns {Promise<Response, Error>} - The response body.
   */
  _get(endpoint, query) {
    const uri = `${this._baseUrl}${endpoint}`
    this._debug(`Making request to: '${uri}?${stringify(query)}'`)

    return got.get(uri, {
      query,
      json: true
    }).then(({ body }) => body)
  }

  /**
   * Make a get request to yts.ag
   * @param {!string} endpoint - The endpoint to make the request to.
   * @param {!number} movieId - The movie id of the movie you want to get.
   * @returns {Promise<Response, Error>} - The response body.
   */
  _getWithMovieId(endpoint, movieId) {
    if (!movieId || typeof movieId !== 'number') {
      throw new Error(`${movieId} is not a valid value for movieId!`)
    }

    return this._get(endpoint, {
      movie_id: movieId
    })
  }

  /**
   * Get a list of movies.
   * @param {!Object} query={} - The query object to be send to yts.
   * @param {!number} [config.limit=20] - Limit the amount of results.
   * @param {!number} [config.page=1] - Which page to get the results from.
   * @param {!string} [config.quality=All] - Search for certain qualities of
   * torrents.
   * @param {!number} [config.minimumRating=0] - The minimum required rating
   * for a movie.
   * @param {?string} [config.queryTerm] - A query term to search for.
   * @param {?Array<string>} [config.genres] - A list of genres to search for.
   * @param {!string} [config.sortBy=date_added] - Which attribute to sort on.
   * @param {!string} [config.orderBy=desc] - Order ascending or descending.
   * @param {?boolean} [config.withRtRatings=false] - Adds Rotten Tomatoes
   * ratings to the result.
   * @returns {Promise<Array<Response>, Error>} -  A list of movies from yts.
   */
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
    if (!YtsApi._qualities[quality]) {
      throw new Error(`${quality} is not a valid value for quality!`)
    }
    if (minimumRating < 0 || minimumRating > 9) {
      throw new Error(
        `${minimumRating} is not a valid value for minimumRating!`
      )
    }
    if (!YtsApi._sortBy[sortyBy]) {
      throw new Error(`${sortyBy} is not a valid value for sortyBy!`)
    }
    if (!YtsApi._orderBy[orderBy]) {
      throw new Error(`${orderBy} is not a valid value for orderBy!`)
    }
    if (typeof withRtRatings !== 'boolean') {
      throw new Error(
        `${withRtRatings} is not a valid value for withRtRatings!`
      )
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

  /**
   * Get details on a movie.
   * @param {!Object} query - The query object to be send to yts.
   * @param {!number} query.movieId - The movie id of the movie you want to
   * get.
   * @param {?boolean} [query.withImages=false] - Adds images to results.
   * @param {?boolean} [query.withCast=false] - Adds cast to results.
   * @returns {Promise<Response, Error>} - A movie from yts.
   */
  getMovie({movieId, withImages = false, withCast = false}) {
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

  /**
   * Get suggestions on a movie.
   * @param {!number} movieId - The id of the movie you want suggestions on.
   * @returns {Promise<Response, Error>} - An object with suggested movies.
   */
  getSuggestions(movieId) {
    return this._getWithMovieId('movie_suggestions.json', movieId)
  }

  /**
   * Get the parental guides on a movie.
   * @param {!number} movieId - The id of the movie you want the parental
   * quides on.
   * @returns {Promise<Response, Error>} - An object with the parental guide.
   */
  getParentalGuides(movieId) {
    return this._getWithMovieId('movie_parental_guides.json', movieId)
  }

}
