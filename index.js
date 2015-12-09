var request = require('request-promise');
var cheerio = require('cheerio');
var debug = require('debug')('youtube-video-info');
var _ = require('lodash');

module.exports = function fetchVideoInfo (videoId, callback) {
  if (!videoId) {
    throw new Error('No video ID is provided.');
  }

  var useCallback = callback && _.isFunction(callback);
  debug('Fetching YouTube page for %s', videoId);

  var pendingPromise = request({
    url: 'https://www.youtube.com/watch?v=' + videoId,
    jar: true,
    headers: {
      'Host': 'www.youtube.com',
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:42.0) Gecko/20100101 Firefox/42.0',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Connection': 'keep-alive',
      'Cache-Control': 'max-age=0'
    }
  }).then(parseVideoInfo).catch(function (reason) {
    debug('Fetch failed %d - %s', reason.statusCode, reason.error);
    throw new Error(reason);
  });

  if (useCallback) {
    pendingPromise.then(function (result) {
      callback(null, result);
    }).catch(function(err) {
      callback(err);
    });
    return;
  }

  return pendingPromise;

  function parseVideoInfo (body) {
    //console.log(body);

    debug('Parsing YouTube page %s', videoId);
    var $ = cheerio.load(body);

    var url = extractValue($('.watch-main-col link[itemprop="url"]'), 'href');
    var title = extractValue($('.watch-main-col meta[itemprop="name"]'), 'content');
    var description = $('.watch-main-col #eow-description').html();
    var owner = $('.yt-user-info > a').text();
    var channelId = extractValue($('.watch-main-col meta[itemprop="channelId"]'), 'content');
    var thumbnailUrl = extractValue($('.watch-main-col link[itemprop="thumbnailUrl"]'), 'href');
    var embedURL = extractValue($('.watch-main-col link[itemprop="embedURL"]'), 'href');
    var datePublished = extractValue($('.watch-main-col meta[itemprop="datePublished"]'), 'content');
    var genre = extractValue($('.watch-main-col meta[itemprop="genre"]'), 'content');

    var paid = extractValue($('.watch-main-col meta[itemprop="paid"]'), 'content');
    paid = paid ? (paid == 'True') : undefined;

    var unlisted = extractValue($('.watch-main-col meta[itemprop="unlisted"]'), 'content');
    unlisted = unlisted ? (unlisted == 'True') : undefined;

    var isFamilyFriendly = extractValue($('.watch-main-col meta[itemprop="isFamilyFriendly"]'), 'content');
    isFamilyFriendly = (isFamilyFriendly && isFamilyFriendly == 'True');

    var duration = extractValue($('.watch-main-col meta[itemprop="duration"]'), 'content');
    duration = duration ? parseDuration(duration) : undefined;

    var regionsAllowed = extractValue($('.watch-main-col meta[itemprop="regionsAllowed"]'), 'content');
    regionsAllowed = regionsAllowed ? regionsAllowed.split(',') : undefined;

    var views = extractValue($('.watch-main-col meta[itemprop="interactionCount"]'), 'content');
    views = views ? parseInt(views, 10) : undefined;

    return {
      videoId: videoId,
      url: url,
      title: title,
      description: description,
      owner: owner,
      channelId: channelId,
      thumbnailUrl: thumbnailUrl,
      embedURL: embedURL,
      datePublished: datePublished,
      genre: genre,
      paid: paid,
      unlisted: unlisted,
      isFamilyFriendly: isFamilyFriendly,
      duration: duration,
      views: views,
      regionsAllowed: regionsAllowed
    };
  }
}

function extractValue($, attribute) {
  if ($ && $.length) {
    return $.attr(attribute) || undefined;
  }
  return undefined;
}

function parseDuration(raw) {
  var m = /^[a-z]*(?:(\d+)M)?(\d+)S$/i.exec(raw);
  if (!m) return;

  var minutes = m[1] ? parseInt(m[1], 10) : 0;
  var seconds = m[2] ? parseInt(m[2], 10) : 0;
  return (minutes * 60) + seconds
}
