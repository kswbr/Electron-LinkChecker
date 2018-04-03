import Parser from '../../../../../src/main/modules/parser.js'

describe('Parser', () => {
  it('load', () => {
    const parser = new Parser()
    expect(typeof (parser)).to.equal('object')
  })

  it('fetch', (done) => {
    const parser = new Parser()
    parser.fetch('http://127.0.0.1:8889').then(($) => {
      expect($('h1').text()).to.equal('test')
      done()
    })
  })

  it('getFilterdHrefList', (done) => {
    const parser = new Parser()
    parser.fetch('http://127.0.0.1:8889').then(($) => {
      const hrefList = parser.getFilteredHrefList('http://127.0.0.1:8889/')
      console.log(hrefList)
      expect(hrefList).to.deep.equal(['link.html', 'linkNotfound.html'])
      done()
    })
  })
})
