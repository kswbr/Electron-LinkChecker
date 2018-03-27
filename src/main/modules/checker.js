'use strict'

import request from 'request'
import url from 'url'

export function getLinkStatus (url) {
  return new Promise((resolve, reject) => {
    request.get({url}, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data.statusCode)
    })
  })
}

export function getUrlInValid (target, ignoreHosts = [], strictHttps = false) {
  if (!target) {
    return { code: 'NOT_SET' }
  }

  const uniqueArray = target.split('').filter(function (item, pos) {
    return target.split('').indexOf(item) !== 0 || pos === 0
  })

  if (uniqueArray[0] === '#' && uniqueArray.length === 1) {
    return { code: 'HASH_ONLY' }
  }

  const hostname = url.parse(target).hostname
  if (hostname) {
    const index = ignoreHosts.indexOf(hostname)
    if (index !== -1) {
      return { code: 'CONTAINS_IGNORE_HOSTNAME', value: ignoreHosts[index] }
    }
  }

  if (strictHttps) {
    const protocol = url.parse(target).protocol
    if (protocol === 'http:') {
      return { code: 'CONTAINS_HTTP_PROTOCOL' }
    }
  }
  return { code: 'OK' }
}
