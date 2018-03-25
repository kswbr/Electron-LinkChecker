import {getLinkStatus} from '../../../../../src/main/modules/checker.js'

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
