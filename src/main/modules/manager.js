'use strict'

import {getLinkStatus, getUrlInValid} from './checker.js'
import Parser from './parser.js'
import url from 'url'
import async from 'async'

export function createURL (baseUrl, targetUrl) {
  if (targetUrl.indexOf('//') === 0) {
    return url.parse(baseUrl).protocol + '' + targetUrl
  }

  if (url.parse(targetUrl).host) {
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
  // console.log('dirname', baseDirname)
  const protocol = url.parse(baseUrl).protocol ? url.parse(baseUrl).protocol : 'http'
  const auth = url.parse(baseUrl).auth ? url.parse(baseUrl).auth : ''
  const host = url.parse(baseUrl).host

  if (targetUrl.indexOf('javascript') === 0) {
    targetUrl = ''
  }

  let pathname = ''

  if ((targetUrl.slice(0, 1) === '/')) {
    pathname = targetUrl.split('#')[0].split('?')[0]
  } else if ((targetUrl.slice(0, 1) === '#')) {
    pathname = url.parse(baseUrl).pathname
  } else {
    pathname = baseDirname + '/' + targetUrl.split('#')[0].split('?')[0]
  }

  const search = url.parse(targetUrl).search
  const hash = url.parse(targetUrl).hash

  // console.log({ protocol, auth, host, pathname, search, targetUrl, hash })
  // console.log(url.format({ protocol, auth, host, pathname, search, hash }))
  // console.log(targetUrl)

  return url.format({ protocol, auth, host, pathname, search, hash })
}

export function isHttps (target) {
  return url.parse(target).protocol === 'https:'
}

export function checkHrefList (event, params, urls) {
  // console.log(params, urls)
  return new Promise((resolve, reject) => {
    let hasError = false
    async.each(urls, (url, callback) => {
      const target = createURL(params.url, url)
      // console.log('createdURL', target)
      getLinkStatus(target).then((code) => {
        // console.log(code)
        if (code !== 200) {
          // console.log(params.url)
          event.sender.send('message', {message: 'ステータスエラー', url: params.url, params: {url: target, code}, type: 'error'})
          hasError = true
        } else {
          // const checkResult = getUrlInValid(target, params.ignoreHosts, isHttps(params.url))
          const checkResult = getUrlInValid(target, params.ignoreHosts, false)
          if (checkResult.code !== 'OK') {
            event.sender.send('message', {message: checkResult.code, url: params.url, params: {url: target}, type: 'error'})
          }
        }
        setTimeout(() => {
          callback()
        }, 500)
      })
    }, (err) => {
      if (err) reject(err)
      if (!hasError) {
        event.sender.send('message', {message: 'aタグにエラーはありませんでした', url: params.url, params: {result: 'OK'}, type: 'success'})
      }
      resolve(!hasError)
      // console.log('finish url')
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
      // console.log('URL OK')
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
  // console.log('runChecks')
  // console.log(params)
  if (!params.valid) {
    return false
  }
  runCheck(event, params).then(() => {
    console.log('OK')
  })
}
