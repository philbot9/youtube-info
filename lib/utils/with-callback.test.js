const withCallback = require('./with-callback')

describe('with-callback', () => {
  it('successful callbacks', done => {
    const fn = (a, b) => Promise.resolve(a + b)

    withCallback(fn)(1, 2, (err, result) => {
      expect(err).toBeNull()
      expect(result).toBe(3)
      done()
    })
  })

  it('failure callbacks', done => {
    const error = new Error('Test error')
    const fn = (a, b) => Promise.reject(error)

    withCallback(fn)(1, 2, (err, result) => {
      expect(err).toEqual(error)
      expect(result).toBeUndefined()
      done()
    })
  })

  it('no callback', () => {
    const fn = (a, b) => Promise.resolve(a + b)
    return expect(withCallback(fn)(1, 2)).resolves.toEqual(3)
  })

  it('just callback', done => {
    const fn = () => Promise.resolve(10)
    withCallback(fn)((err, result) => {
      expect(err).toBeNull()
      expect(result).toBe(10)
      done()
    })
  })
})
