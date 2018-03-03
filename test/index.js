var expect = require('chai').expect
var fetchVideoInfo = require('../index')

describe('youtube-info', function () {
  it('should export a function', function () {
    expect(require('../index')).to.be.a('function')
  })

  it('should support callback functions', function (done) {
    this.timeout(60000)
    fetchVideoInfo('oT7xCWDQkXU', function (err, videoInfo) {
      expect(err).not.to.exist
      expect(videoInfo).to.exist
      expect(videoInfo)
        .to.have.a.property('title')
        .which.is.a('string')
      done()
    })
  })

  it('should return errors for callback functions', function (done) {
    this.timeout(60000)
    fetchVideoInfo('fakeID', function (err, videoInfo) {
      expect(err).to.exist
      expect(videoInfo).not.to.exist
      done()
    })
  })

  it('should support promises', function () {
    this.timeout(60000)
    return fetchVideoInfo('oT7xCWDQkXU').then(function (videoInfo) {
      expect(videoInfo).to.exist
      expect(videoInfo)
        .to.have.a.property('title')
        .which.is.a('string')
    })
  })

  it('should return errors for promises', function () {
    this.timeout(60000)
    return fetchVideoInfo('fakeID').catch(function (err) {
      expect(err).to.exist
    })
  })

  it('should throw an error if no video ID is provided', function () {
    expect(fetchVideoInfo).to.throw(Error)
    expect(function () {
      fetchVideoInfo(null)
    }).to.throw(Error)
  })

  it('should return video info', function () {
    this.timeout(60000)
    return fetchVideoInfo('NyK5SG9rwWI').then(function (videoInfo) {
      expect(videoInfo).to.exist
      expect(videoInfo)
        .to.have.a.property('videoId')
        .which.is.a('string')
      expect(videoInfo)
        .to.have.a.property('url')
        .which.is.a('string')
      expect(videoInfo)
        .to.have.a.property('title')
        .which.is.a('string')
      expect(videoInfo)
        .to.have.a.property('description')
        .which.is.a('string')
      expect(videoInfo)
        .to.have.a.property('owner')
        .which.is.a('string')
      expect(videoInfo)
        .to.have.a.property('channelId')
        .which.is.a('string')
      expect(videoInfo)
        .to.have.a.property('thumbnailUrl')
        .which.is.a('string')
      expect(videoInfo)
        .to.have.a.property('embedURL')
        .which.is.a('string')
      expect(videoInfo)
        .to.have.a.property('datePublished')
        .which.is.a('string')
      expect(videoInfo)
        .to.have.a.property('genre')
        .which.is.a('string')
      expect(videoInfo)
        .to.have.a.property('paid')
        .which.is.a('boolean')
      expect(videoInfo)
        .to.have.a.property('unlisted')
        .which.is.a('boolean')
      expect(videoInfo)
        .to.have.a.property('isFamilyFriendly')
        .which.is.a('boolean')
      expect(videoInfo)
        .to.have.a.property('duration')
        .which.is.a('number')
        .above(0)
      expect(videoInfo)
        .to.have.a.property('views')
        .which.is.a('number')
        .above(0)
      expect(videoInfo)
        .to.have.a.property('regionsAllowed')
        .which.is.a('array')
      expect(videoInfo)
        .to.have.a.property('commentCount')
        .which.is.a('number')
        .above(0)
      expect(videoInfo.regionsAllowed).to.have.length.above(0)
      expect(videoInfo)
          .to.have.a.property('likeCount')
          .which.is.a('number')
          .above(0)
      expect(videoInfo)
          .to.have.a.property('dislikeCount')
          .which.is.a('number')
          .above(0)
    })
  })
})
