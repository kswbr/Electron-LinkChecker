import {getLinkStatus, getUrlInValid} from '../../../../../src/main/modules/checker.js'

describe('getLinkStatus', () => {
  it('200', (done) => {
    getLinkStatus('http://example.com').then((code) => {
      expect(code).to.equal(200)
      done()
    })
  })
  it('404', (done) => {
    getLinkStatus('https://github.com/_404').then((code) => {
      expect(code).to.equal(404)
      done()
    })
  })
})

describe('getUrlInValid', () => {
  it('NOT_SET', () => {
    const result = getUrlInValid()
    expect(result.code).to.equal('NOT_SET')
  })

  it('CONTAINS_CMS_HOSTNAME', () => {
    const result = getUrlInValid('https://obayashidev.powercms.hosting/works')
    expect(result.code).to.equal('CONTAINS_CMS_HOSTNAME')
  })
  it('HASH_ONLY', () => {
    expect(getUrlInValid('#').code).to.equal('HASH_ONLY')
    expect(getUrlInValid('###').code).to.equal('HASH_ONLY')
  })

  it('OK', () => {
    expect(getUrlInValid('https://github.com/pulls#').code).to.equal('OK')
    expect(getUrlInValid('/pulls#').code).to.equal('OK')
    expect(getUrlInValid('#12346').code).to.equal('OK')
    expect(getUrlInValid('?test=1').code).to.equal('OK')
  })
})
