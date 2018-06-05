import {getLinkStatus} from './checker.js'
import Parser from './parser.js'

export function rootUrlCheck (url) {
  console.log(url)
}

const parser = new Parser()

export default class Manager {
  runChecks (event, params) {
    console.log('runChecks')
    console.log(params)
    if (!params.valid) {
      return false
    }
    console.log('getLinkStatus')
    Promise.resolve(1)
      .then(() => getLinkStatus(params.url))
      .then((code) => new Promise((resolve, reject) => {
        if (code !== 200) {
          event.sender.send('message', {url: params.url, message: '有効ではないURLです', params: {url: params.url, code}, type: 'error'})
          return
        }
        console.log('URL OK')
        resolve()
      }))
      .then(() => new Promise((resolve, reject) => {
        parser.fetch(params.url).then(($) => {
          const hrefList = parser.getFilteredHrefList(params.url)
          console.log(hrefList)
          console.log(parser.parsedInfo)
          resolve()
        })
      }))
      .catch((err) => {
        console.log('getLinkStatusError')
        console.error(err)
      })
  }
}
