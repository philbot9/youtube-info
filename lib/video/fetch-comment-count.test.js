const request = require('request-promise')
const fetchCommentCount = require('./fetch-comment-count')

jest.mock('request-promise')

describe('fetch-comment-count', () => {
  afterEach(() => jest.clearAllMocks())

  it('fetches the comment count', () => {
    const videoId = 'abc123'
    const sessionToken = 'session123'
    const commentsToken = 'comments123'
    const opts = { cookieJar: { cookie: 'jar' }, language: 'de' }

    const response = {
      body: {
        'watch-discussion': `
          <div class="comments-header-renderer">
            <h2 class="comment-section-header-renderer">
              <b>Comments</b> • 111,444,696
            </h2>
          </div>
        `
      }
    }

    request.mockReturnValue(Promise.resolve(JSON.stringify(response)))

    return expect(
      fetchCommentCount(videoId, { sessionToken, commentsToken }, opts)
    ).resolves
      .toEqual({ commentCount: 111444696 })
      .then(() => {
        expect(request.mock.calls[0][0]).toMatchObject({
          method: 'POST',
          jar: opts.cookieJar,
          qs: {
            v: videoId,
            ctoken: commentsToken
          },
          headers: {
            'Accept-Language': opts.language
          },
          form: {
            session_token: sessionToken
          }
        })
      })
  })

  it('fetches comment count when using dot delimiters', () => {
    const videoId = 'abc123'
    const sessionToken = 'session123'
    const commentsToken = 'comments123'
    const opts = { cookieJar: { cookie: 'jar' }, language: 'de' }

    const response = {
      body: {
        'watch-discussion': `
          <div class="comments-header-renderer">
            <h2 class="comment-section-header-renderer">
              <b>Comments</b> • 111.444.696
            </h2>
          </div>
        `
      }
    }

    request.mockReturnValue(Promise.resolve(JSON.stringify(response)))

    return expect(
      fetchCommentCount(videoId, { sessionToken, commentsToken }, opts)
    ).resolves
      .toEqual({ commentCount: 111444696 })
      .then(() => {
        expect(request.mock.calls[0][0]).toMatchObject({
          method: 'POST',
          jar: opts.cookieJar,
          qs: {
            v: videoId,
            ctoken: commentsToken
          },
          headers: {
            'Accept-Language': opts.language
          },
          form: {
            session_token: sessionToken
          }
        })
      })
  })

  it('fetches comment count when using space delimiters', () => {
    const videoId = 'abc123'
    const sessionToken = 'session123'
    const commentsToken = 'comments123'
    const opts = { cookieJar: { cookie: 'jar' }, language: 'de' }

    const response = {
      body: {
        'watch-discussion': `
          <div class="comments-header-renderer">
            <h2 class="comment-section-header-renderer">
              <b>Comments</b> • 111 444 696
            </h2>
          </div>
        `
      }
    }

    request.mockReturnValue(Promise.resolve(JSON.stringify(response)))

    return expect(
      fetchCommentCount(videoId, { sessionToken, commentsToken }, opts)
    ).resolves
      .toEqual({ commentCount: 111444696 })
      .then(() => {
        expect(request.mock.calls[0][0]).toMatchObject({
          method: 'POST',
          jar: opts.cookieJar,
          qs: {
            v: videoId,
            ctoken: commentsToken
          },
          headers: {
            'Accept-Language': opts.language
          },
          form: {
            session_token: sessionToken
          }
        })
      })
  })

  it('failure', () => {
    const videoId = 'abc123'
    const sessionToken = 'session123'
    const commentsToken = 'comments123'
    const opts = { cookieJar: { cookie: 'jar' }, language: 'de' }

    const error = new Error('testerror')

    request.mockReturnValue(Promise.reject(error))

    return expect(
      fetchCommentCount(videoId, { sessionToken, commentsToken }, opts)
    ).rejects.toThrow(error)
  })
})
