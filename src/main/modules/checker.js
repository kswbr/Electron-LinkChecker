'use strict'

import request from 'request'
import url from 'url'

export function getLinkStatus (url) {
  return new Promise((resolve, reject) => {
    request.get({url}, (err, data) => {
      if (err) {
        reject(err)
      }
      console.log(data.statusCode)
      resolve(data.statusCode)
    })
  })
}

export function getUrlInValid (target) {
  if (!target) {
    return { result: 1, code: 'NOT_SET' }
  }

  const uniqueArray = target.split('').filter(function (item, pos) {
    return target.split('').indexOf(item) !== 0 || pos === 0
  })

  if (uniqueArray[0] === '#' && uniqueArray.length === 1) {
    return { result: 1, code: 'HASH_ONLY' }
  }

  const hostname = url.parse(target).hostname
  if (hostname) {
    if (hostname.match(/powercms/)) {
      return { result: 2, code: 'CONTAINS_CMS_HOSTNAME' }
    }
  }

  return { result: 0, code: 'OK' }
}
