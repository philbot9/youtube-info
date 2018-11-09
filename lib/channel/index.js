const request = require('request-promise')
const cheerio = require('cheerio')
const debug = require('debug')('youtube-info:channel')
const R = require('ramda')

const fetchChannelDetails = require('./fetch-channel-details')

module.exports = (channelId, userOpts) => {
  if (!channelId) {
    throw new Error('Missing parameter channel ID')
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

  debug('Fetching channel info for %s with %o', channelId, options)

  return fetchChannelDetails(channelId, options)
}

function isObject (x) {
  return R.is(Object, x)
}
