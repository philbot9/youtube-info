const video = require('./index')

describe('video - integration test', () => {
  const checkNonTranslated = result => {
    expect(result.id).toBe('Rb0UmrCXxVA')
    expect(result.publishedAt).toBe('2013-01-08')
    expect(result.url).toBe('https://www.youtube.com/watch?v=Rb0UmrCXxVA')

    expect(result.channelId).toBe('UCyOfqgtsQaM3S-VZnsYnHjQ')
    expect(result.channelTitle).toBe('HALIDONMUSIC')
    expect(result.channelThumbnailUrl).toBe(
      'https://yt3.ggpht.com/a-/AN66SAx3O8vHEfMXi1FU5Inz6CTEmtE8piFG_hqisQ=s48-c-k-c0xffffffff-no-rj-mo'
    )
    expect(result.thumbnails).toMatchObject({
      high: {
        url: 'https://i.ytimg.com/vi/Rb0UmrCXxVA/hqdefault.jpg',
        width: 480,
        height: 360
      }
    })
    expect(result.duration).toBe('PT116M2S')
    expect(result.durationInSeconds).toBe(6962)
    expect(result.viewCount).toBeGreaterThanOrEqual(160257989)
    expect(result.likeCount).toBeGreaterThanOrEqual(677714)
    expect(result.dislikeCount).toBeGreaterThanOrEqual(48791)
    expect(result.embedUrl).toBe('https://www.youtube.com/embed/Rb0UmrCXxVA')
    expect(result.paid).toBe(false)
    expect(result.unlisted).toBe(false)
    expect(result.isFamilyFriendly).toBe(true)
    expect(result.tags.length).toBeGreaterThanOrEqual(32)
    result.tags.forEach(t => {
      expect(typeof t).toBe('string')
      expect(t.length).toBeGreaterThan(0)
    })

    expect(Array.isArray(result.regionsAllowed)).toBe(true)
    expect(result.regionsAllowed.length).toBeGreaterThan(10)
    result.regionsAllowed.forEach(r => {
      expect(r.length).toBeLessThanOrEqual(3)
      expect(r).toMatch(/^\w+$/)
    })

    expect(result.commentCount).toBeGreaterThanOrEqual(44696)
  }

  it('default language', () => {
    return video('Rb0UmrCXxVA').then(result => {
      expect(result.title).toBe('The Best of Mozart')

      expect(typeof result.description).toBe('string')
      expect(result.description.length).toBeGreaterThan(100)

      expect(typeof result.descriptionHtml).toBe('string')
      expect(result.descriptionHtml.length).toBeGreaterThan(
        result.description.length
      )
      expect(result.descriptionHtml).toMatch(/<br>/gi)

      expect(result.category).toBe('Music')

      checkNonTranslated(result)
    })
  })

  it('non-default language', () => {
    return video('Rb0UmrCXxVA', { language: 'fr' }).then(result => {
      expect(result.title).toBe('Le Meilleur de Mozart')

      expect(typeof result.description).toBe('string')
      expect(result.description.length).toBeGreaterThan(100)

      expect(typeof result.descriptionHtml).toBe('string')
      expect(result.descriptionHtml.length).toBeGreaterThan(
        result.description.length
      )
      expect(result.descriptionHtml).toMatch(/<br>/gi)

      expect(result.category).toBe('Musique')

      checkNonTranslated(result)
    })
  })
})
