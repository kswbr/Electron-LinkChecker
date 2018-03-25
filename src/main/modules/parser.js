import request from 'request'
import cheerio from 'cheerio'

export default class Parser {
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

  set $ ($) {
    this._$ = $
  }

  get res () {
    return this.res
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
