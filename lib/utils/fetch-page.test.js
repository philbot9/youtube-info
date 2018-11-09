const request = require('request-promise')
const cheerio = require('cheerio')

const fetchPage = require('./fetch-page')
jest.mock('request-promise')
jest.mock('cheerio')

describe('fetch-page', () => {
  afterEach(() => jest.clearAllMocks())

  it('fetches a page', () => {
    const opts = { url: 'http://someurl.com', headers: { stuff: 'here' } }
    const body = '<html>some html</html>'
    const $ = { cheerio: 'object' }

    request.mockReturnValue(Promise.resolve(body))
    cheerio.load.mockReturnValue($)

    return expect(fetchPage(opts)).resolves.toEqual($).then(() => {
      expect(request.mock.calls[0][0]).toMatchObject(opts)
      expect(cheerio.load).toHaveBeenCalledWith(body)
    })
  })

  it('failure', () => {
    const opts = { url: 'http://someurl.com', headers: { stuff: 'here' } }
    const error = new Error('Some error')

    request.mockReturnValue(Promise.reject(error))

    return expect(fetchPage(opts)).rejects.toThrow(error).then(() => {
      expect(request.mock.calls[0][0]).toMatchObject(opts)
      expect(cheerio.load).not.toHaveBeenCalled()
    })
  })
})
