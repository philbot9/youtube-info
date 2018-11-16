const parseBoolean = require('./parse-boolean')

describe('parse-boolean', () => {
  it('parses a boolean', () => {
    expect(parseBoolean('True')).toBe(true)
    expect(parseBoolean('TRUE')).toBe(true)
    expect(parseBoolean('true')).toBe(true)
    expect(parseBoolean('tRUe')).toBe(true)

    expect(parseBoolean('False')).toBe(false)
    expect(parseBoolean('FALSE')).toBe(false)
    expect(parseBoolean('false')).toBe(false)
    expect(parseBoolean('fALsE')).toBe(false)
  })

  it('returns undefined for empty input', () => {
    expect(parseBoolean()).toBeUndefined()
    expect(parseBoolean(null)).toBeUndefined()
    expect(parseBoolean('')).toBeUndefined()
  })

  it('returns undefined for invalid input', () => {
    expect(parseBoolean('Gobbledigoog')).toBeUndefined()
    expect(parseBoolean('So true')).toBeUndefined()
    expect(parseBoolean('false, innit?')).toBeUndefined()
  })
})
