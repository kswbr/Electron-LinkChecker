import request from 'request'
import cheerio from 'cheerio'
import URL from 'url'

const getDirname = (path) => {
  let result = path.replace(/\\/g, '/').replace(/\/[^/]*$/, '')
  if (result.match(/^[^/]*\.[^/.]*$/)) {
    result = ''
  }
  return result
}

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

  getFilteredHrefList (target) {
    const {protocol, host, pathname} = URL.parse(target)
    const baseDirname = getDirname(pathname)
    const origin = protocol + '//' + host + baseDirname
    const notProtocolOrigin = '//' + host + baseDirname

    return this._parsedInfo.hrefList.filter((path) => {
      path = URL.parse(path).href
      if (path === origin || path === notProtocolOrigin) {
        return false
      }
      if (path === '') {
        return false
      }
      if (path.indexOf(origin) === 0) {
        return true
      } else if (path.indexOf(notProtocolOrigin) === 0) {
        return true
      } else if (path.indexOf('/') !== 0 && !URL.parse(path).host) {
        return true
      } else if (path.indexOf(pathname) === 0) {
        return true
      } else {
        // console.log(path)
        return false
      }
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
