module.exports = function(){
  const assert = require('chai').assert

  describe('State port tests', function(){
    var fakeIssue

    beforeEach(function(){
      fakeIssue = {id: 'fakeId', description: 'fakeDescription', state: 'fakeState'}
    })

    describe('Register and retrieve issues', function(){
      it('must retrieve the issue with the same data they were registered', async function(){
        await this.adapter.registerIssue(fakeIssue)
        const issues = await this.adapter.getIssues()
        const retrievedIssue = issues[0]

        assert.strictEqual(fakeIssue.id, retrievedIssue.id)
        assert.strictEqual(fakeIssue.description, retrievedIssue.description)
        assert.strictEqual(fakeIssue.state, retrievedIssue.state)
      })

      it('must register a copy of the issue', async function(){
        const originalId = fakeIssue.id
        await this.adapter.registerIssue(fakeIssue)
        fakeIssue.id = 'anotherId'
        const issues = await this.adapter.getIssues()
        const retrievedIssue = issues[0]

        assert.strictEqual(originalId, retrievedIssue.id)
      })
    })

    describe('SetIssueState', function(){
      context('Given an issue is registered', function(){
        beforeEach(async function(){
          await this.adapter.registerIssue(fakeIssue)
        })

        it('must modify the state of the issue with the specified id', async function(){
          await this.adapter.setIssueState({id: fakeIssue.id, state: 'newState'})
          const issues = await this.adapter.getIssues()
          const issue = issues[0]

          assert.strictEqual('newState', issue.state)
        })
      })
    })

    describe('Clear', function(){
      context('Given an issue is registered', function(){
        beforeEach(async function(){
          await this.adapter.registerIssue(fakeIssue)
        })

        it('must remove the existing issues', async function(){
          await this.adapter.clear()
          const issues = await this.adapter.getIssues()
          assert.strictEqual(0, issues.length)
        })
      })
    })
  })
}
