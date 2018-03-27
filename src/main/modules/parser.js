import request from 'request'
import cheerio from 'cheerio'

const createPasedInfo = ($) => {
  return {
    hrefList: $('a').map((i, el) => {
      return $(el).attr('href')
    }).get(),
    imgList: $('img').map((i, el) => {
      return $(el).attr('src')
    }).get(),
    scriptList: $('script').map((i, el) => {
      return $(el).attr('src')
    }).get(),
    linkList: $('link').map((i, el) => {
      return $(el).attr('href')
    }).get()
  }
}

export default class Parser {
  constructor () {
    this._parsedInfo = {}
  }

  fetch (url) {
    return new Promise((resolve, reject) => {
      request(url, (err, res, body) => {
        if (err) {
          reject(err)
          return
        }
        this.res = res
        this.body = body
        const $ = this.parse(body)
        this._parsedInfo = createPasedInfo($)
        resolve($)
      })
    })
  }

  parse (body) {
    this.$ = cheerio.load(body)
    return this.$
  }

  get $ () {
    return this._$
  }

  get parsedInfo () {
    return this._parsedInfo
  }

  set $ ($) {
    this._$ = $
  }

  get res () {
    return this._res
  }

  set res (res) {
    this._res = res
  }

  get body () {
    return this._body
  }

  set body (body) {
    this._body = body
  }
}
