const adapter = require('./PersistentState')
const port = require('../../ports/State')

describe('PersistentState', function(){
  beforeEach(async function(){
    this.adapter = adapter({writingDirectory: 'temp/testStateStorage'})
    await this.adapter.clear()
  })
  port()
})
