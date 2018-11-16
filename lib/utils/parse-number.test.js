const parseNumber = require('./parse-number')

describe('parseNumber', () => {
  it('returns undefined for invalid input', () => {
    expect(parseNumber()).toBeUndefined()
    expect(parseNumber(1)).toBeUndefined()
    expect(parseNumber('')).toBeUndefined()
  })

  it('returns undefined if number cannot be parsed', () => {
    expect(parseNumber('text')).toBeUndefined()
  })

  it('parses a number', () => {
    expect(parseNumber('1')).toBe(1)
    expect(parseNumber('123,456,789')).toBe(123456789)
    expect(parseNumber('99 bottles of beer')).toBe(99)
    expect(parseNumber('There are 98 bottles of beer')).toBe(98)
  })
})
