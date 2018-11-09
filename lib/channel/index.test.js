const channel = require('./index')
const fetchChannelDetails = require('./fetch-channel-details')
const request = require('request-promise')

jest.mock('./fetch-channel-details', () =>
  jest.fn(() =>
    Promise.resolve({
      channel: 'details'
    })
  )
)

jest.mock('request-promise', () => ({
  jar: jest.fn(() => ({ cookie: 'jar' }))
}))

describe('channel', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('exports a function', () => {
    expect(typeof channel).toBe('function')
  })

  it('happy path', () => {
    const channelId = 'abc123'
    const opts = { language: 'fr' }

    return expect(channel(channelId, opts)).resolves
      .toEqual({
        channel: 'details'
      })
      .then(() => {
        const fullOpts = { language: 'fr', cookieJar: request.jar() }
        expect(fetchChannelDetails).toHaveBeenCalledWith(channelId, fullOpts)
      })
  })

  describe('opts parameter', () => {
    const defaultOpts = {
      language: 'en-US',
      cookieJar: request.jar()
    }

    it('no opts', () => {
      return expect(channel('abc123')).resolves
        .toEqual({
          channel: 'details'
        })
        .then(() => {
          expect(fetchChannelDetails.mock.calls[0][1]).toEqual(defaultOpts)
        })
    })

    it('opts', () => {
      const myOpts = { language: 'fr' }
      return expect(channel('abc123', myOpts)).resolves
        .toEqual({
          channel: 'details'
        })
        .then(() => {
          expect(fetchChannelDetails.mock.calls[0][1]).toEqual(
            Object.assign({}, myOpts, { cookieJar: request.jar() })
          )
        })
    })
  })
})
