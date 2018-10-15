'use strict'

import request from 'request'
import url from 'url'

export function getLinkStatus (inputUrl) {
  return new Promise((resolve, reject) => {
    if (inputUrl.indexOf('http') !== 0) {
      resolve('NOT HTTP REQUEST')
    }
    request({url: inputUrl, method: 'GET'}, (err, data) => {
      if (err) {
        console.error('REQUEST ERROR')
        console.error(err)
        console.error(data)
        console.error(inputUrl)
        resolve('REQUEST ERROR')
        return
      }
      resolve(data.statusCode)
    })
  })
}

export function getUrlInValid (target, ignoreHosts = [], strictHttps = false) {
  if (!target) {
    // return {code: 'NOT_SET', type: 'warning'}
    return {code: 'OK'}
  }

  const uniqueArray = target.split('').filter(function (item, pos) {
    return target.split('').indexOf(item) !== 0 || pos === 0
  })

  if (uniqueArray[0] === '#' && uniqueArray.length === 1) {
    // return {code: 'HASH_ONLY', type: 'warning'}
    return {code: 'OK'}
  }

  const hostname = url.parse(target).hostname
  if (hostname) {
    const index = ignoreHosts.indexOf(hostname)
    if (index !== -1) {
      return {code: 'CONTAINS_IGNORE_HOSTNAME', value: ignoreHosts[index], type: 'error'}
    }
  }

  if (strictHttps) {
    const protocol = url.parse(target).protocol
    if (protocol === 'http:') {
      return {code: 'CONTAINS_HTTP_PROTOCOL', type: 'error'}
    }
  }
  return {code: 'OK'}
}
