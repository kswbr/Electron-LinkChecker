'use strict'

import {getLinkStatus} from './checker.js'
import Parser from './parser.js'
import url from 'url'
import async from 'async'

export function createURL (baseUrl, targetUrl) {
  if (url.parse(targetUrl).hostname) {
    return targetUrl
  }

  const getDirname = (path) => {
    let result = path.replace(/\\/g, '/').replace(/\/[^/]*$/, '')
    if (result.match(/^[^/]*\.[^/.]*$/)) {
      result = ''
    }
    return result
  }

  const baseDirname = getDirname(url.parse(baseUrl).pathname)
  console.log('dirname', baseDirname)
  const protocol = url.parse(baseUrl).protocol ? url.parse(baseUrl).protocol : 'http'
  const auth = url.parse(baseUrl).auth ? url.parse(baseUrl).auth : ''
  const host = url.parse(baseUrl).host
  const pathname = (targetUrl.slice(0, 1) === '/') ? targetUrl.split('#')[0] : baseDirname + '/' + targetUrl.split('#')[0]
  const query = url.parse(targetUrl).query
  const hash = url.parse(targetUrl).hash

  console.log({ protocol, auth, host, pathname, query, targetUrl, hash })

  return url.format({ protocol, auth, host, pathname, query, hash })
}

export function checkHrefList (event, params, urls) {
  console.log(params, urls)
  return new Promise((resolve, reject) => {
    let hasError = false
    async.each(urls, (url, callback) => {
      const target = createURL(params.url, url)
      console.log('createdURL', target)
      getLinkStatus(target).then((code) => {
        console.log(code)
        if (code !== 200) {
          console.log(params.url)
          event.sender.send('message', {message: 'ステータスエラー', url: params.url, params: {url: target, code}, type: 'error'})
          hasError = true
        }
        callback()
      })
    }, (err) => {
      if (err) reject(err)
      if (!hasError) {
        event.sender.send('message', {message: 'aタグにエラーはありませんでした', url: params.url, params: {result: 'OK'}, type: 'success'})
      }
      resolve()
      console.log('finish url')
    })
  })
}

export function runCheck (event, params) {
  const parser = new Parser()

  return Promise.resolve(1)
    .then(() => getLinkStatus(params.url))
    .then((code) => new Promise((resolve, reject) => {
      if (code !== 200) {
        event.sender.send('message', {message: 'ステータスエラー', url: params.url, params: {code}, type: 'error'})
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
    .then(() => checkHrefList(event, params, parser.parsedInfo.hrefList))
    .catch((err) => {
      console.log('getLinkStatusError')
      console.error(err)
    })
}

export function runChecks (event, params) {
  console.log('runChecks')
  console.log(params)
  if (!params.valid) {
    return false
  }
  runCheck(event, params).then(() => {
    console.log('OK')
  })
}
