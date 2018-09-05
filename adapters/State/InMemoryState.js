module.exports = function(){
  var issues = []

  return Object.freeze({
    registerIssue,
    getIssues,
    setIssueState,
    clear
  })

  async function clear(){
    issues = []
  }

  async function registerIssue(issue){
    const issueCopy = JSON.parse(JSON.stringify(issue));
    issues.push(issueCopy)
  }

  async function getIssues(){
    return issues
  }

  async function setIssueState({id, state}){
    const foundIssue = issues.find(function(issue){
        return issue.id === id
    })

    foundIssue.state = state
  }
}
