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
      id: channelId
    }

    fetchPage.mockReturnValue(
      Promise.resolve(
        cheerio.load(
          `
        <div>
          <div class='branded-page-v2-body'>
            <div>hello</div>
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
          url: `https://www.youtube.com/channel/${channelId}`,
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
          url: `https://www.youtube.com/watch?v=${channelId}`,
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
          <div class="watch-main-col">
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
          url: `https://www.youtube.com/watch?v=${channelId}`,
          jar: opts.cookieJar
        })
        expect(reqOpts.headers).toMatchObject({
          'Accept-Language': opts.language
        })
      })
  })
})
