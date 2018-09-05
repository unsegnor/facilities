var {After, Before} = require('cucumber');

Before(async function () {
  await this.state.clear()
})
