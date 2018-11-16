const cheerio = require('cheerio')
const extractValue = require('./cheerio-extract-value')

describe('cheerio-extract-value', () => {
  it('extracts a value', () => {
    const $ = cheerio.load(
      '<div class="test" id="test-id" title="test-title">stuff</div>'
    )

    expect(extractValue($('.test'), 'id')).toBe('test-id')
    expect(extractValue($('.test'), 'title')).toBe('test-title')
  })

  it('returns undefined if there is no match', () => {
    const $ = cheerio.load(
      '<div class="test" id="test-id" title="test-title">stuff</div>'
    )

    expect(extractValue($('.not-real'), 'title')).toBeUndefined()
  })

  it('returns undefined if attribute does not exist', () => {
    const $ = cheerio.load('<div class="test" id="test-id">stuff</div>')

    expect(extractValue($('.test'), 'title')).toBeUndefined()
  })

  it('transforms a value if it exists', () => {
    const $ = cheerio.load('<div class="test" id="test-id">stuff</div>')
    const transform = jest.fn(() => 'transformed')

    expect(extractValue($('.test'), 'id', transform)).toBe('transformed')
    expect(transform).toHaveBeenCalledWith('test-id')
  })

  it('does not transform a value that does not exist', () => {
    const $ = cheerio.load('<div class="test" id="test-id">stuff</div>')
    const transform = jest.fn(() => 'transformed')

    expect(extractValue($('.test'), 'blah', transform)).toBeUndefined()
    expect(transform).not.toHaveBeenCalled()
  })
})
