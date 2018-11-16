const R = require('ramda')
const htmlToText = require('html-to-text')

const fetchPage = require('../utils/fetch-page')
const parseNumber = require('../utils/parse-number')
const extractValue = require('../utils/cheerio-extract-value')

module.exports = (channelId, opts) =>
  fetchPage({
    url: `https://www.youtube.com/channel/${channelId}/about`,
    headers: {
      'Accept-Language': opts.language
    },
    jar: opts.cookieJar
  })
    .then(parseChannelInfo)
    .then(R.filter(x => x != null))

function parseChannelInfo ($) {
  if (!$('.branded-page-v2-body').children().length) {
    throw new Error('Channel does not exist.')
  }

  const id = extractValue(
    $('#watch-container meta[itemprop="channelId"]'),
    'content'
  )

  const url = extractValue($('#watch-container > link[itemprop="url"]'), 'href')

  const title = extractValue($('h1 a.branded-page-header-title-link'), 'title')

  const subscriberCount = extractValue(
    $('.yt-subscription-button-subscriber-count-branded-horizontal'),
    'title',
    parseNumber
  )

  const description = $('.about-description pre').html()

  return {
    id,
    url,
    title,
    subscriberCount,
    description
  }
}

function buildThumbnails ($thumbnail) {
  if (!$thumbnail) {
    return
  }

  const url = extractValue($thumbnail.find('link[itemprop="url"]'), 'href')
  const width = extractValue(
    $thumbnail.find('meta[itemprop="width"]'),
    'content',
    x => parseInt(x, 10)
  )
  const height = extractValue(
    $thumbnail.find('meta[itemprop="height"]'),
    'content',
    x => parseInt(x, 10)
  )

  if (!url) {
    return
  }

  const filename = url.replace(/^.+\/(\w+)\.\w+$/, '$1')

  const type = {
    default: 'default',
    mqdefault: 'medium',
    hqdefault: 'high',
    sddefault: 'standard',
    maxresdefault: 'maxres'
  }[filename]

  return {
    [type]: { url, width, height }
  }
}

function parseBoolean (raw) {
  return raw ? raw === 'True' : undefined
}
