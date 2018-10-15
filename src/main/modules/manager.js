'use strict'

import {getLinkStatus, getUrlInValid} from './checker.js'
import Parser from './parser.js'
import url from 'url'
import async from 'async'

const URL = url.URL
let visitedList = []
let checkList = []
let queOk = true
let timer = null

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

  // console.log('createURL')
  // console.log(baseUrl)
  // console.log(url.parse(baseUrl))
  return new URL(url.format({ protocol, auth, host, pathname, search, hash })).href
}

export function isHttps (target) {
  return url.parse(target).protocol === 'https:'
}

export function checkTags (event, params, urls, tag) {
  return new Promise((resolve, reject) => {
    let hasError = false
    event.sender.send('message', {message: tag + 'タグのチェックを開始します', url: params.url, params: {result: 'CHECK START'}, type: 'success'})
    async.eachLimit(urls, 1, (url, callback) => {
      const target = createURL(params.requestUrl, url)
      console.log(target)
      setTimeout(() => getLinkStatus(target).then((code) => {
        // console.log(target)

        if (code !== 200) {
          event.sender.send('message', {message: tag + 'タグにステータスエラー', url: params.url, params: {url: createURL(params.url, url), code}, type: 'error'})
          hasError = true
        } else {
          const strictHttps = tag !== 'a' ? isHttps(params.url) : false
          const checkResult = getUrlInValid(url, params.ignoreHosts, strictHttps)
          if (checkResult.code !== 'OK') {
            event.sender.send('message', {message: checkResult.code, url: params.url, params: {url: createURL(params.url, url)}, type: checkResult.type})
            if (checkResult.type === 'error') {
              hasError = true
            }
          }
        }
        callback()
      }), 50)
    }, (err) => {
      if (err) reject(err)
      if (!hasError) {
        event.sender.send('message', {message: tag + 'タグにエラーはありませんでした', url: params.url, params: {result: 'OK'}, type: 'success'})
      }
      resolve(!hasError)
    })
  })
}

export function check (event, params) {
  const parser = new Parser()
  return new Promise((resolve, reject) => {
    getLinkStatus(params.requestUrl)
      .then((code) => new Promise((resolve, reject) => {
        if (code !== 200) {
          event.sender.send('message', {message: 'ステータスエラー', url: params.url, params: {code}, type: 'error'})
          return
        }
        // console.log('URL OK')
        resolve()
      }))
      .then(() => parser.fetch(params.requestUrl))
      .then(() => checkTags(event, params, parser.parsedInfo.hrefList, 'a'))
      .then(() => checkTags(event, params, parser.parsedInfo.scriptList, 'script'))
      .then(() => checkTags(event, params, parser.parsedInfo.linkList, 'link'))
      .then(() => checkTags(event, params, parser.parsedInfo.imgList, 'img'))
      .then(() => resolve(parser))
  })
}
export function runNextCheck (event, params, parser) {
  return new Promise((resolve, reject) => {
    const hrefList = parser.getFilteredHrefList(params.url).filter((list) => list.indexOf('#') !== 0)
    async.eachLimit(hrefList, 1, (href, callback) => {
      const target = createURL(params.url, href)
      registerCheck(event, Object.assign({}, params, {url: target}))
      setTimeout(() => {
        callback()
      }, 100)
    }, (err) => {
      if (err) {
        console.error(err)
      }
      resolve()
    })
  })
}

export function runCheck (event, params) {
  return Promise.resolve(1)
    .then(() => check(event, params))
    .then((parser) => runNextCheck(event, params, parser))
    .catch((err) => {
      console.log('getLinkStatusError')
      console.error(err)
    })
}

export function keepChecksOfQue (event, params, interval) {
  console.log('keepQue')
  if (timer) return

  timer = setInterval(() => {
    if (!queOk) return
    const que = checkList.shift()
    if (que) {
      queOk = false
      console.log('executeQue')
      runCheck(que.event, que.params).then(() => { queOk = true })
    }
  }, interval)
}

export function registerCheck (event, params) {
  // console.log('registerCheck')
  if (visitedList.indexOf(params.url) > -1) {
    return false
  } else {
    visitedList.push(params.url)
  }

  if (params.auth.username && params.auth.password) {
    let authUrl = new URL(params.url)
    authUrl.username = params.auth.username
    authUrl.password = params.auth.password
    params.requestUrl = authUrl.href
  } else {
    params.requestUrl = params.url
  }

  console.log('registerCheck')
  console.log(params)

  checkList.push({event, params})
}

export function runChecks (event, params) {
  // console.log('runChecks')
  // console.log(params)
  if (!params.valid) {
    return false
  }
  visitedList = []
  checkList = []
  queOk = true
  registerCheck(event, params)
  keepChecksOfQue(event, params, 1000)
}
