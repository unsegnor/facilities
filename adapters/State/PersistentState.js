module.exports = function({writingDirectory}){
  const storage = require('node-persist');
  const ISSUES_ID = 'issuesID'
  var issues =  []
  var initialized = false

  return Object.freeze({
    registerIssue,
    getIssues,
    setIssueState,
    clear
  })

  async function clear(){
    await init()
    issues = []
    await saveIssues()
  }

  async function registerIssue(issue){
    await loadIssues()
    issues.push(issue)
    await saveIssues()
  }

  async function getIssues(){
    await loadIssues()
    return issues
  }

  async function setIssueState({id, state}){
    await loadIssues()
    const foundIssue = issues.find(function(issue){
        return issue.id === id
    })

    foundIssue.state = state
    await saveIssues()
  }

  async function saveIssues(){
    await storage.setItem(ISSUES_ID, issues)
  }

  async function loadIssues(){
    init()
    issues = await storage.getItem(ISSUES_ID) || []
  }

  async function init(){
    if(!initialized){
      await storage.init({dir: writingDirectory});
      initialized = true
    }
  }
}
