# yts-api-pt

[![Build Status][travis-image]][travis-url]
[![Coverage Status][coverage-image]][coverage-url]
[![Dependency Status][david-image]][david-url]
[![devDependency Status][dev-david-image]][dev-david-url]

[travis-url]: https://travis-ci.org/ChrisAlderson/yts-api-pt
[travis-image]: https://travis-ci.org/ChrisAlderson/yts-api-pt.svg?branch=master
[coverage-url]: https://coveralls.io/github/ChrisAlderson/yts-api-pt?branch=master
[coverage-image]: https://coveralls.io/repos/github/ChrisAlderson/yts-api-pt/badge.svg?branch=master
[david-url]: https://david-dm.org/ChrisAlderson/yts-api-pt
[david-image]: https://david-dm.org/ChrisAlderson/yts-api-pt.svg
[dev-david-url]: https://david-dm.org/ChrisAlderson/yts-api-pt?type=dev
[dev-david-image]: https://david-dm.org/ChrisAlderson/yts-api-pt/dev-status.svg

A NodeJS wrapper for [yts.ag](https://yts.ag/).

## Usage

#### Setup
```
npm install --save yts-api-pt
```

#### Initialize
```js
const YtsApi = require('eztv-api-pt')

// Create a new instance of the module.
const yts = new YtsApi({
  baseUrl // The base url of yts. Defaults to 'https://yts.ag/'.
})
```

#### Example usage

**getMovies:**
```js
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
})
```

**getMovie:**
```js
yts.getMovie({
  movieId: 15,
  withImages: true,
  withCast: true
}).then(res => console.log(res))
  .catch(err => console.error(err))
```

**getSuggestions:**
```js
yts.getSuggestions(15)
  .then(res => console.log(res))
  .catch(err => console.error(err))
```

**getParentalGuides:**
```js
yts.getParentalGuides(15)
  .then(res => console.log(res))
  .catch(err => console.error(err))
```

## Output

**getMovies:**
```js
{
  "status": "ok",
  "status_message": "Query was successful",
  "data": {
    "movie_count": 1,
    "limit": 20,
    "page_number": 1,
    "movies": [<movies>]
  },
  "@meta": {
    "server_time": 1487195100,
    "server_timezone": "EST5EDT",
    "api_version": 2,
    "execution_time": "0 ms"
  }
}
```

**getMovie:**
```js
{
  "status": "ok",
  "status_message": "Query was successful",
  "data": {
    "movie": <movie>
  },
  "@meta": {
    "server_time": 1487195033,
    "server_timezone": "EST5EDT",
    "api_version": 2,
    "execution_time": "0.01 ms"
  }
}
```

**getSuggestions:**
```js
{
  "status": "ok",
  "status_message": "Query was successful",
  "data": {
    "movie_count": 4,
    "movies": [<movies>]
  },
  "@meta": {
    "server_time": 1487194963,
    "server_timezone": "EST5EDT",
    "api_version": 2,
    "execution_time": "0 ms"
  }
}
```

**getParentalGuides:**
```js
{
  "status": "ok",
  "status_message": "Query was successful",
  "data": {
    "parental_guide_count": 1,
    "parental_guides": [{
      "type": "Info",
      "parental_guide_text": "Parental Guide for all the movies will be republished soon. Thank you for understanding!"
    }]
  },
  "@meta": {
    "server_time": 1487194752,
    "server_timezone": "EST5EDT",
    "api_version": 2,
    "execution_time": "0 ms"
  }
}
```

**Movie Example:**
```js
{
  "id": 1606,
  "url": "https://yts.ag/movie/inception-2010",
  "imdb_code": "tt1375666",
  "title": "Inception",
  "title_english": "Inception",
  "title_long": "Inception (2010)",
  "slug": "inception-2010",
  "year": 2010,
  "rating": 8.8,
  "runtime": 148,
  "genres": [
    "Action",
    "Adventure",
    "Crime",
    "Mystery",
    "Sci-Fi",
    "Thriller"
  ],
  "summary": "",
  "description_full": "",
  "synopsis": "",
  "yt_trailer_code": "YoHD9XEInc0",
  "language": "English",
  "mpa_rating": "PG-13",
  "background_image": "https://yts.ag/assets/images/movies/Inception_2010/background.jpg",
  "background_image_original": "https://yts.ag/assets/images/movies/Inception_2010/background.jpg",
  "small_cover_image": "https://yts.ag/assets/images/movies/Inception_2010/small-cover.jpg",
  "medium_cover_image": "https://yts.ag/assets/images/movies/Inception_2010/medium-cover.jpg",
  "large_cover_image": "https://yts.ag/assets/images/movies/Inception_2010/large-cover.jpg",
  "state": "ok",
  "torrents": [{
    "url": "",
    "hash": "",
    "quality": "720p",
    "seeds": 634,
    "peers": 108,
    "size": "1.07 GB",
    "size_bytes": 1148903752,
    "date_uploaded": "2015-11-01 00:14:37",
    "date_uploaded_unix": 1446351277
  }],
  "date_uploaded": "2015-11-01 00:14:37",
  "date_uploaded_unix": 1446351277
}
```

## Testing

You can run tests with the following npm command:
```
 $ npm test
```

# License

MIT License
