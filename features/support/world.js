const { setWorldConstructor } = require('cucumber')
const System = require('../../src/System')
const State = require('../../adapters/State/InMemoryState')

class CustomWorld {
  constructor(){
    var state = State()
    this.state = state
    this.system = System({state});
  }
}

setWorldConstructor(CustomWorld)
