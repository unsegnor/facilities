const { Given, When, Then } = require('cucumber')
const assert = require('chai').assert

Given('Employee has registered an issue with an image and the description {string}', async function (description) {
  this.currentIssueId = 'fakeId'
  await this.system.registerIssue({id: this.currentIssueId, image: 'fakeImageData', description})
})

Given('Employee has registered an issue', async function () {
  this.currentIssueId = 'fakeId'
  await this.system.registerIssue({id: this.currentIssueId, image: 'fakeImageData', description: 'fakeDescription'})
})

When('Employee ask the system for the existing issues', async function () {
  this.currentIssues = await this.system.getExistingIssues()
})

Then('the returned issues must include an issue with the description {string} and the state {string}', async function (expectedDescription, expectedState) {
  const existsIssue = this.currentIssues.some(function(issue){
    return issue.description == expectedDescription && issue.state == expectedState
  })
  assert.isOk(existsIssue)
})

Then('the returned issues must not include an issue with the description {string}', function (expectedDescription) {
  const existsIssue = this.currentIssues.some(function(issue){
    return issue.description == expectedDescription
  })
  assert.isNotOk(existsIssue)
})

Then('the state of the issue must be {string}', async function (expectedState) {
  const issue = await this.system.getIssue(this.currentIssueId)
  assert.sctrictEqual(expectedState, issue.state)
})

When('Responsible indicates that is working on it', async function () {
  await this.system.workingOnIssue(this.currentIssueId)
})

When('the Responsible indicates that it is fixed', async function () {
  await this.system.fixedIssue(this.currentIssueId)
})

Given('Employee is registered in the system', async function () {
  this.userId = 'EmployeeId'
  await this.system.registerUser(this.userId)
})

Then('Employee is notified as the issue state has changed to {string}', function (newIssueState) {
  this.notifier.userHasBeenNotified({userId: this.userId, issueDescription: this.currentIssueDescription, newIssueState})
})
