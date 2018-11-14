const cheerio = require('cheerio')

const fetchPage = require('../utils/fetch-page')
const fetchVideoDetails = require('./fetch-video-details')

jest.mock('../utils/fetch-page')

describe('fetch-video-details', () => {
  afterEach(() => jest.clearAllMocks())

  it('success', () => {
    const videoId = 'abc123'
    const opts = {
      videoId,
      cookieJar: { cookie: 'jar' },
      language: 'de'
    }

    const expected = {
      id: videoId,
      publishedAt: '2018-01-01',
      url: 'https://youtube.com/watch?v=abc123',
      title: 'Video Title',
      description: 'Description text here',
      descriptionHtml: '<p>Description text here</p>',
      tags: ['tag1', 'tag2', 'tag3'],
      channelId: 'def456',
      channelTitle: 'Test Channel',
      channelThumbnailUrl: 'http://testurl.xyz/channel.jpg',
      thumbnails: {
        high: {
          url: 'http://thumbnails.org/hqdefault.jpg',
          width: 300,
          height: 200
        }
      },
      category: 'Testing',
      duration: 'PT01M10S',
      durationInSeconds: 70,
      viewCount: 10,
      likeCount: 5,
      dislikeCount: 4,
      embedUrl: 'http://embed.url/here',
      paid: true,
      unlisted: true,
      isFamilyFriendly: false,
      regionsAllowed: ['de', 'ca', 'us']
    }

    fetchPage.mockReturnValue(
      Promise.resolve(
        cheerio.load(
          `
        <div>
          <meta property="og:video:tag" content="${expected.tags[0]}">
          <meta property="og:video:tag" content="${expected.tags[1]}">
          <meta property="og:video:tag" content="${expected.tags[2]}">
          <div class="watch-main-col">
            <meta itemprop="name" content="Wrong title">
            <meta itemprop="videoId" content="${expected.id}">
            <meta itemprop="datePublished" content="${expected.publishedAt}">
            <link itemprop="url" href="${expected.url}">
            <h1 id="eow-title" title="${expected.title}">${expected.title}</h1>
            <div id="eow-description">${expected.descriptionHtml}</div>
            <meta itemprop="channelId" content="${expected.channelId}">
            <div class="yt-user-info"><a>${expected.channelTitle}</a></div>
            <div class="yt-user-photo">
              <div class="yt-thumb-clip">
                <img data-thumb="${expected.channelThumbnailUrl}">
              </div>
            </div>
            <span itemprop="thumbnail">
              <link itemprop="url" href="${expected.thumbnails.high.url}">
              <meta itemprop="width" content="${expected.thumbnails.high.width}">
              <meta itemprop="height" content="${expected.thumbnails.high.height}">
            </span>
            <ul class="watch-extras-section">
            <li><a href="/channel/blah">${expected.category}</a></li>
            </ul>
            <meta itemprop="duration" content="${expected.duration}">
            <meta itemprop="interactionCount" content="${expected.viewCount}">
            <div class="like-button-renderer-like-button-unclicked">
              <span>${expected.likeCount}</span>
            </div>
            <div class="like-button-renderer-dislike-button-unclicked">
              <span>${expected.dislikeCount}</span>
            </div>
            <link itemprop="embedURL" href="${expected.embedUrl}">
            <meta itemprop="paid" content="${expected.paid ? 'True' : 'False'}">
            <meta itemprop="unlisted" content="${expected.unlisted ? 'True' : 'False'}">
            <meta itemprop="isFamilyFriendly" content="${expected.isFamilyFriendly ? 'True' : 'False'}">
            <meta itemprop="regionsAllowed" content="${expected.regionsAllowed.join(',')}">
          </div>
        </div>
      `
        )
      )
    )

    return expect(fetchVideoDetails(videoId, opts)).resolves
      .toEqual(expected)
      .then(() => {
        const reqOpts = fetchPage.mock.calls[0][0]
        expect(reqOpts).toMatchObject({
          url: `https://www.youtube.com/watch?v=${videoId}`,
          jar: opts.cookieJar
        })
        expect(reqOpts.headers).toMatchObject({
          'Accept-Language': opts.language
        })
      })
  })

  it('failure', () => {
    const videoId = 'abc123'
    const opts = {
      videoId,
      cookieJar: { cookie: 'jar' },
      language: 'de'
    }
    const error = new Error('Test Error')

    fetchPage.mockReturnValue(Promise.reject(error))

    return expect(fetchVideoDetails(videoId, opts)).rejects
      .toThrow(error)
      .then(() => {
        const reqOpts = fetchPage.mock.calls[0][0]
        expect(reqOpts).toMatchObject({
          url: `https://www.youtube.com/watch?v=${videoId}`,
          jar: opts.cookieJar
        })
        expect(reqOpts.headers).toMatchObject({
          'Accept-Language': opts.language
        })
      })
  })

  it('video does not exist', () => {
    const videoId = 'abc123'
    const opts = {
      videoId,
      cookieJar: { cookie: 'jar' },
      language: 'de'
    }

    fetchPage.mockReturnValue(
      Promise.resolve(
        cheerio.load(
          `
        <div>
          <div class="watch-main-col">
          </div>
        </div>
      `
        )
      )
    )

    return expect(fetchVideoDetails(videoId, opts)).rejects
      .toThrow(new Error('Video does not exist.'))
      .then(() => {
        const reqOpts = fetchPage.mock.calls[0][0]
        expect(reqOpts).toMatchObject({
          url: `https://www.youtube.com/watch?v=${videoId}`,
          jar: opts.cookieJar
        })
        expect(reqOpts.headers).toMatchObject({
          'Accept-Language': opts.language
        })
      })
  })
})
