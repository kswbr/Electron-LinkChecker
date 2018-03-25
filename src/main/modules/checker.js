'use strict'

import request from 'request'

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
