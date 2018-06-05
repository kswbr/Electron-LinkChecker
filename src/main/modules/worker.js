import Parser from './parser.js'
import {getLinkStatus} from './checker.js'

export default class Worker {
  constructor (app) {
    this.app = app
  }

  receiveUrl (url, rootUrl) {
    return new Promise((resolve, reject) => {
      this.url = url
      this.$ = {}
      const parser = new Parser()
      this.parser = parser
      this.statusCode = null

      getLinkStatus(url).then((code) => {
        this.statusCode = code
        return parser.fetch(this.url)
      }).then(($) => {
        const nextLinks = parser.getFilteredHrefList(rootUrl)
        const parsedInfo = parser.parsedInfo
        const body = parser.body
        const res = parser.res
        const statusCode = this.statusCode

        this.$ = $
        resolve({
          nextLinks,
          parsedInfo,
          body,
          statusCode,
          res
        })
      })
    })
  }
}
