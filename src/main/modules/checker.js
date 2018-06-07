'use strict'

import request from 'request'
import url from 'url'

export function getLinkStatus (url) {
  return new Promise((resolve, reject) => {
    request.get({url}, (err, data) => {
      if (err) {
        console.log('REQUEST ERROR')
        console.log(err)
        reject(err)
        return
      }
      resolve(data.statusCode)
    })
  })
}

export function getUrlInValid (target, ignoreHosts = [], strictHttps = false) {
  if (!target) {
    return {code: 'NOT_SET', type: 'warning'}
  }

  const uniqueArray = target.split('').filter(function (item, pos) {
    return target.split('').indexOf(item) !== 0 || pos === 0
  })

  if (uniqueArray[0] === '#' && uniqueArray.length === 1) {
    return {code: 'HASH_ONLY', type: 'warning'}
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
