const R = require('ramda')
const htmlToText = require('html-to-text')

const fetchPage = require('../utils/fetch-page')
const extractValue = require('../utils/cheerio-extract-value')
const parseNumber = require('../utils/parse-number')
const parseBoolean = require('../utils/parse-boolean')

module.exports = (videoId, opts) =>
  fetchPage({
    url: `https://www.youtube.com/watch?v=${videoId}`,
    headers: {
      'Accept-Language': opts.language
    },
    jar: opts.cookieJar
  })
    .then(parseVideoInfo)
    .then(R.filter(x => x != null))

function parseVideoInfo ($) {
  if (!$('.watch-main-col').children().length) {
    throw new Error('Video does not exist.')
  }

  const id = extractValue(
    $('.watch-main-col meta[itemprop="videoId"]'),
    'content'
  )

  const publishedAt = extractValue(
    $('.watch-main-col meta[itemprop="datePublished"]'),
    'content'
  )

  const url = extractValue($('.watch-main-col > link[itemprop="url"]'), 'href')

  const title = extractValue($('#eow-title'), 'title')

  const descriptionHtml = $('.watch-main-col #eow-description').html()

  // cheerio's .text() doesn't seem to preserve line breaks
  const description = htmlToText.fromString(descriptionHtml, {
    wordwrap: false,
    ignoreHref: true,
    ignoreImage: true
  })

  const tags = []
  $('meta[property="og:video:tag"]').each(function () {
    tags.push(extractValue($(this), 'content'))
  })

  const channelId = extractValue(
    $('.watch-main-col meta[itemprop="channelId"]'),
    'content'
  )

  const channelTitle = $('.yt-user-info > a').text()

  const channelThumbnailUrl = $('.yt-user-photo .yt-thumb-clip img').data(
    'thumb'
  )

  const thumbnails = buildThumbnails(
    $('.watch-main-col span[itemprop="thumbnail"]')
  )

  const categoryLink = $('.watch-extras-section > li a')

  const category = categoryLink.length &&
    /channel\/.+/i.test(categoryLink.attr('href'))
    ? categoryLink.text()
    : undefined

  const duration = extractValue(
    $('.watch-main-col meta[itemprop="duration"]'),
    'content'
  )
  const durationInSeconds = duration
    ? parseDurationInSeconds(duration)
    : undefined

  const viewCount = extractValue(
    $('.watch-main-col meta[itemprop="interactionCount"]'),
    'content',
    parseNumber
  )

  const likeCount = parseNumber(
    $('.like-button-renderer-like-button-unclicked span').text()
  )

  const dislikeCount = parseNumber(
    $('.like-button-renderer-dislike-button-unclicked span').text()
  )

  const embedUrl = extractValue(
    $('.watch-main-col link[itemprop="embedURL"]'),
    'href'
  )

  const paid = extractValue(
    $('.watch-main-col meta[itemprop="paid"]'),
    'content',
    parseBoolean
  )

  const unlisted = extractValue(
    $('.watch-main-col meta[itemprop="unlisted"]'),
    'content',
    parseBoolean
  )

  const isFamilyFriendly = extractValue(
    $('.watch-main-col meta[itemprop="isFamilyFriendly"]'),
    'content',
    parseBoolean
  )

  const regionsAllowed = extractValue(
    $('.watch-main-col meta[itemprop="regionsAllowed"]'),
    'content',
    x => (x ? x.split(',') : undefined)
  )

  const sessionToken = extractSessionToken($)

  const commentsToken = extractCommentsToken($)

  return {
    id,
    publishedAt,
    url,
    title,
    description,
    descriptionHtml,
    tags,
    channelId,
    channelTitle,
    channelThumbnailUrl,
    thumbnails,
    category,
    duration,
    durationInSeconds,
    viewCount,
    likeCount,
    dislikeCount,
    embedUrl,
    paid,
    unlisted,
    isFamilyFriendly,
    regionsAllowed,
    sessionToken,
    commentsToken
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
    parseNumber
  )
  const height = extractValue(
    $thumbnail.find('meta[itemprop="height"]'),
    'content',
    parseNumber
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

function parseDurationInSeconds (raw) {
  const m = /^[a-z]*(?:(\d+)M)?(\d+)S$/i.exec(raw)
  if (!m) return

  const minutes = m[1] ? parseInt(m[1], 10) : 0
  const seconds = m[2] ? parseInt(m[2], 10) : 0
  return minutes * 60 + seconds
}

function extractSessionToken ($) {
  var m = /XSRF_TOKEN':\s*"(.+?)",/i.exec($('body').html())
  return m ? m[1] : undefined
}

function extractCommentsToken ($) {
  var m = /COMMENTS_TOKEN':\s*"(.+?)",/i.exec($('body').html())
  return m ? m[1] : undefined
}
