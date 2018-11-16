const cheerio = require('cheerio')

const fetchPage = require('../utils/fetch-page')
const fetchChannelDetails = require('./fetch-channel-details')

jest.mock('../utils/fetch-page')

describe('fetch-channel-details', () => {
  afterEach(() => jest.clearAllMocks())

  it('success', () => {
    const channelId = 'abc123'
    const opts = {
      cookieJar: { cookie: 'jar' },
      language: 'de'
    }

    const expected = {
      id: channelId,
      url: `https://www.youtube.com/channel/${channelId}`,
      title: 'Test title',
      description: 'Test description\nwith some\n\nnew lines',
      subscriberCount: 155633789
    }

    fetchPage.mockReturnValue(
      Promise.resolve(
        cheerio.load(
          `
          <div>
            <div id="watch-container">
              <link itemprop="url" href="https://www.youtube.com/channel/${expected.id}">
              <meta itemprop="channelId" content="${expected.id}">
            </div>
            
            <div class='branded-page-v2-body'>
              <div class="yt-subscription-button-subscriber-count-branded-horizontal" title="155,633,789"></div>
              <h1><a class="branded-page-header-title-link" title="${expected.title}">${expected.title}</a></h1>
            
              <div class="about-description">
                <pre>${expected.description}</pre>
              </div>
            </div>
          </div>
        `
        )
      )
    )

    return expect(fetchChannelDetails(channelId, opts)).resolves
      .toEqual(expected)
      .then(() => {
        const reqOpts = fetchPage.mock.calls[0][0]
        expect(reqOpts).toMatchObject({
          url: `https://www.youtube.com/channel/${channelId}/about`,
          jar: opts.cookieJar
        })
        expect(reqOpts.headers).toMatchObject({
          'Accept-Language': opts.language
        })
      })
  })

  it('failure', () => {
    const channelId = 'abc123'
    const opts = {
      channelId,
      cookieJar: { cookie: 'jar' },
      language: 'de'
    }
    const error = new Error('Test Error')

    fetchPage.mockReturnValue(Promise.reject(error))

    return expect(fetchChannelDetails(channelId, opts)).rejects
      .toThrow(error)
      .then(() => {
        const reqOpts = fetchPage.mock.calls[0][0]
        expect(reqOpts).toMatchObject({
          url: `https://www.youtube.com/channel/${channelId}/about`,
          jar: opts.cookieJar
        })
        expect(reqOpts.headers).toMatchObject({
          'Accept-Language': opts.language
        })
      })
  })

  it('video does not exist', () => {
    const channelId = 'abc123'
    const opts = {
      channelId,
      cookieJar: { cookie: 'jar' },
      language: 'de'
    }

    fetchPage.mockReturnValue(
      Promise.resolve(
        cheerio.load(
          `
        <div>
          <div class='branded-page-v2-body'>
          </div>
        </div>
      `
        )
      )
    )

    return expect(fetchChannelDetails(channelId, opts)).rejects
      .toThrow(new Error('Channel does not exist.'))
      .then(() => {
        const reqOpts = fetchPage.mock.calls[0][0]
        expect(reqOpts).toMatchObject({
          url: `https://www.youtube.com/channel/${channelId}/about`,
          jar: opts.cookieJar
        })
        expect(reqOpts.headers).toMatchObject({
          'Accept-Language': opts.language
        })
      })
  })
})
