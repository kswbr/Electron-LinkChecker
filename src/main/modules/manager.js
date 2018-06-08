'use strict'

import {getLinkStatus, getUrlInValid} from './checker.js'
import Parser from './parser.js'
import url from 'url'
import async from 'async'

let visitedList = []
const URL = url.URL

export function createURL (baseUrl, targetUrl) {
  if (targetUrl.indexOf('javascript') === 0) {
    targetUrl = ''
  }

  if (targetUrl === '') {
    return baseUrl
  }

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

  return new URL(url.format({ protocol, auth, host, pathname, search, hash })).href
}

export function isHttps (target) {
  return url.parse(target).protocol === 'https:'
}

export function checkHrefList (event, params, urls) {
  return new Promise((resolve, reject) => {
    let hasError = false
    async.each(urls, (url, callback) => {
      const target = createURL(params.url, url)
      console.log('target')
      console.log(target)
      console.log(params.url)
      console.log(url)
      getLinkStatus(target).then((code) => {
        if (code !== 200) {
          event.sender.send('message', {message: 'ステータスエラー', url: params.url, params: {url: target, code}, type: 'error'})
          hasError = true
        } else {
          const checkResult = getUrlInValid(target, params.ignoreHosts, false)
          if (checkResult.code !== 'OK') {
            event.sender.send('message', {message: checkResult.code, url: params.url, params: {url: target}, type: 'error'})
            hasError = true
          }
        }
        setTimeout(() => {
          callback()
        }, 1000)
      })
    }, (err) => {
      if (err) reject(err)
      if (!hasError) {
        event.sender.send('message', {message: 'aタグにエラーはありませんでした', url: params.url, params: {result: 'OK'}, type: 'success'})
      }
      resolve(!hasError)
    })
  })
}

export function checkScriptList (event, params, urls) {
  return new Promise((resolve, reject) => {
    let hasError = false
    async.each(urls, (url, callback) => {
      const target = createURL(params.url, url)
      getLinkStatus(target).then((code) => {
        if (code !== 200) {
          event.sender.send('message', {message: 'ステータスエラー', url: params.url, params: {url: target, code}, type: 'error'})
          hasError = true
        } else {
          const checkResult = getUrlInValid(target, params.ignoreHosts, isHttps(params.url))
          if (checkResult.code !== 'OK') {
            event.sender.send('message', {message: checkResult.code, url: params.url, params: {url: target}, type: 'error'})
          }
        }
        setTimeout(() => {
          callback()
        }, 1000)
      })
    }, (err) => {
      if (err) reject(err)
      if (!hasError) {
        event.sender.send('message', {message: 'scriptタグにエラーはありませんでした', url: params.url, params: {result: 'OK'}, type: 'success'})
      }
      resolve(!hasError)
    })
  })
}

export function checkLinkList (event, params, urls) {
  return new Promise((resolve, reject) => {
    let hasError = false
    async.each(urls, (url, callback) => {
      const target = createURL(params.url, url)
      getLinkStatus(target).then((code) => {
        if (code !== 200) {
          event.sender.send('message', {message: 'ステータスエラー', url: params.url, params: {url: target, code}, type: 'error'})
          hasError = true
        } else {
          const checkResult = getUrlInValid(target, params.ignoreHosts, isHttps(params.url))
          if (checkResult.code !== 'OK') {
            event.sender.send('message', {message: checkResult.code, url: params.url, params: {url: target}, type: 'error'})
          }
        }
        setTimeout(() => {
          callback()
        }, 1000)
      })
    }, (err) => {
      if (err) reject(err)
      if (!hasError) {
        event.sender.send('message', {message: 'linkタグにエラーはありませんでした', url: params.url, params: {result: 'OK'}, type: 'success'})
      }
      resolve(!hasError)
    })
  })
}

export function checkImgList (event, params, urls) {
  return new Promise((resolve, reject) => {
    let hasError = false
    async.each(urls, (url, callback) => {
      const target = createURL(params.url, url)
      getLinkStatus(target).then((code) => {
        if (code !== 200) {
          event.sender.send('message', {message: 'ステータスエラー', url: params.url, params: {url: target, code}, type: 'error'})
          hasError = true
        } else {
          const checkResult = getUrlInValid(target, params.ignoreHosts, isHttps(params.url))
          if (checkResult.code !== 'OK') {
            event.sender.send('message', {message: checkResult.code, url: params.url, params: {url: target}, type: 'error'})
          }
        }
        setTimeout(() => {
          callback()
        }, 1000)
      })
    }, (err) => {
      if (err) reject(err)
      if (!hasError) {
        event.sender.send('message', {message: 'imgタグにエラーはありませんでした', url: params.url, params: {result: 'OK'}, type: 'success'})
      }
      resolve(!hasError)
    })
  })
}

export function runCheck (event, params) {
  console.log(params)
  const parser = new Parser()
  if (visitedList.indexOf(params.url) > -1) {
    return false
  } else {
    visitedList.push(params.url)
  }

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
    .then(() => parser.fetch(params.url))
    .then(() => checkHrefList(event, params, parser.parsedInfo.hrefList))
    .then(() => checkScriptList(event, params, parser.parsedInfo.scriptList))
    .then(() => checkLinkList(event, params, parser.parsedInfo.linkList))
    .then(() => checkImgList(event, params, parser.parsedInfo.imgList))
    .then(() => new Promise((resolve, reject) => {
      const hrefList = parser.getFilteredHrefList(params.url).filter((list) => list.indexOf('#') !== 0)
      console.log(hrefList)
      hrefList.forEach((href) => {
        console.log('href')
        console.log(href)
        const target = createURL(params.url, href)
        console.log('target')
        console.log(target)
        console.log('next params')
        console.log(Object.assign({}, params, {url: target}))

        setTimeout(() => {
          runCheck(event, Object.assign({}, params, {url: target}))
        }, 2000)
      })
    }))
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
  visitedList = []
  runCheck(event, params).then(() => {
    console.log('OK')
  })
}
