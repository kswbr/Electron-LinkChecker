import utils from '../utils'

describe('ipc test', function () {
  beforeEach(utils.beforeEach)
  afterEach(utils.afterEach)

  it('ping pong', function (done) {
    this.app.electron.ipcRenderer.on('reply', (event, arg) => {
      expect(arg).to.equal('pong')
    })
    this.app.electron.ipcRenderer.send('ping')
    done()
  })
})
