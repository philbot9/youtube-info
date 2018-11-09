const request = require('request-promise')
const cheerio = require('cheerio')
const debug = require('debug')('youtube-info:video')
const R = require('ramda')

const fetchVideoDetails = require('./fetch-video-details')
const fetchCommentCount = require('./fetch-comment-count')

module.exports = (videoId, userOpts) => {
  if (!videoId) {
    throw new Error('Missing parameter video ID')
  }

  const options = Object.assign(
    {
      language: 'en-US'
    },
    userOpts,
    {
      cookieJar: request.jar()
    }
  )

  debug('Fetching video info for %s with %o', videoId, options)

  const pending = fetchVideoDetails(videoId, options).then(details =>
    fetchCommentCount(
      videoId,
      {
        sessionToken: details.sessionToken,
        commentsToken: details.commentsToken
      },
      options
    )
      .then(R.merge(details))
      .then(R.omit(['sessionToken', 'commentsToken']))
  )

  return pending
}

function isObject (x) {
  return R.is(Object, x)
}
