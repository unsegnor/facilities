const adapter = require('./InMemoryState')
const port = require('../../ports/State')

describe('InMemoryState', function(){
  beforeEach(function(){
    this.adapter = adapter()
  })
  port()
})
