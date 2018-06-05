import Worker from '../../../../../src/main/modules/worker.js'

describe('Worker', () => {
  it('load', () => {
    const worker = new Worker({})
    expect(typeof (worker)).to.equal('object')
  })

  it('receiveUrl', (done) => {
    const worker = new Worker({})
    worker.receiveUrl('http://127.0.0.1:8889', 'http://127.0.0.1:8889/').then((infos) => {
      expect(infos.statusCode).to.equal(200)
      done()
    })
  })

  it('receiveUrlNotFound', (done) => {
    const worker = new Worker({})
    worker.receiveUrl('http://127.0.0.1:8889/errorNotFoundError', 'http://127.0.0.1:8889/').then((infos) => {
      expect(infos.statusCode).to.equal(404)
      done()
    })
  })
})
