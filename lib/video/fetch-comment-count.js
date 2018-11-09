const request = require('request-promise')
const cheerio = require('cheerio')

module.exports = (videoId, { sessionToken, commentsToken }, opts) =>
  request({
    method: 'POST',
    jar: opts.cookieJar,
    url: 'https://www.youtube.com/watch_fragments_ajax',
    qs: {
      v: videoId,
      tr: 'scroll',
      distiller: '1',
      ctoken: commentsToken,
      frags: 'comments',
      spf: 'load'
    },
    headers: {
      'Accept-Language': opts.language,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache'
    },
    form: {
      session_token: sessionToken,
      client_url: 'https://www.youtube.com/watch?v=' + videoId
    }
  })
    .then(parseCommentCount)
    .then(commentCount => ({ commentCount }))

function parseCommentCount (body) {
  const response = JSON.parse(body)
  if (!response || !response.body || !response.body['watch-discussion']) {
    return 0
  }

  const $ = cheerio.load(response.body['watch-discussion'])
  const m = /\s*•\s*([\d,.\s]+)/i.exec(
    $('.comments-header-renderer h2.comment-section-header-renderer').text()
  )
  if (!m || !m[1]) {
    return 0
  }

  return parseInt(m[1].replace(/[,.\s]/g, ''), 10)
}
