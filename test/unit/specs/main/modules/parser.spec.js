import Parser from '../../../../../src/main/modules/parser.js'

describe('Parser', () => {
  it('load', () => {
    const parser = new Parser()
    expect(typeof (parser)).to.equal('object')
  })

  it('fetch', (done) => {
    const parser = new Parser()
    parser.fetch('https://ja.wikipedia.org/wiki/%E3%83%86%E3%82%B9%E3%83%88').then(($) => {
      expect($('h1.firstHeading').text()).to.equal('テスト')
      done()
    })
  })
})
