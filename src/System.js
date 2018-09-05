module.exports = function({state}){
  return Object.freeze({
    registerIssue,
    getExistingIssues,
    workingOnIssue,
    fixedIssue
  })

  async function registerIssue(issue){
    issue.state = 'Accepted'
    await state.registerIssue(issue)
  }

  async function getExistingIssues(){
    const issues = await state.getIssues()
    return issues.filter(function(issue){
      return issue.state != 'Fixed'
    })
  }

  async function workingOnIssue(issueId){
    await state.setIssueState({id: issueId, state: 'In progress'})
  }

  async function fixedIssue(issueId){
    await state.setIssueState({id: issueId, state: 'Fixed'})
  }
}
