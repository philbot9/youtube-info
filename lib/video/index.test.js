const video = require('./index')
const fetchVideoDetails = require('./fetch-video-details')
const fetchCommentCount = require('./fetch-comment-count')
const request = require('request-promise')

jest.mock('./fetch-video-details', () =>
  jest.fn(() =>
    Promise.resolve({
      video: 'details',
      sessionToken: '123Session',
      commentsToken: '123Comment'
    })
  )
)
jest.mock('./fetch-comment-count', () =>
  jest.fn(() => Promise.resolve({ commentCount: 200 }))
)
jest.mock('request-promise', () => ({
  jar: jest.fn(() => ({ cookie: 'jar' }))
}))

describe('video', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('exports a function', () => {
    expect(typeof video).toBe('function')
  })

  it('happy path', () => {
    const videoId = 'abc123'
    const opts = { language: 'fr' }

    return expect(video(videoId, opts)).resolves
      .toEqual({
        video: 'details',
        commentCount: 200
      })
      .then(() => {
        const fullOpts = { language: 'fr', cookieJar: request.jar() }
        expect(fetchVideoDetails).toHaveBeenCalledWith(videoId, fullOpts)
        expect(fetchCommentCount).toHaveBeenCalledWith(
          videoId,
          {
            sessionToken: '123Session',
            commentsToken: '123Comment'
          },
          fullOpts
        )
      })
  })

  describe('opts parameter', () => {
    const defaultOpts = {
      language: 'en-US',
      cookieJar: request.jar()
    }

    it('no opts', () => {
      return expect(video('abc123')).resolves
        .toEqual({
          commentCount: 200,
          video: 'details'
        })
        .then(() => {
          expect(fetchVideoDetails.mock.calls[0][1]).toEqual(defaultOpts)
          expect(fetchCommentCount.mock.calls[0][2]).toEqual(defaultOpts)
        })
    })

    it('opts', () => {
      const myOpts = { language: 'fr' }
      return expect(video('abc123', myOpts)).resolves
        .toEqual({
          commentCount: 200,
          video: 'details'
        })
        .then(() => {
          expect(fetchVideoDetails.mock.calls[0][1]).toEqual(
            Object.assign({}, myOpts, { cookieJar: request.jar() })
          )
          expect(fetchCommentCount.mock.calls[0][2]).toEqual(
            Object.assign({}, myOpts, { cookieJar: request.jar() })
          )
        })
    })
  })
})
