var TelegramBot = require('node-telegram-bot-api'),
    bot = new TelegramBot("YOUR_TOKEN", { polling: true }),
    System = require('../src/System'),
    State = require('../adapters/State/PersistentState')

var shortid = require('shortid');

var systemState = State({writingDirectory: 'data'})
var system = System({state: systemState})
var userState = {}

const INITIAL_STATE = 'initial state'
const REPORTING_ISSUE_STATE = 'reporing an issue'

const REPORT_ISSUE_ACTION = '1'
const REGISTER_ISSUE_ACTION = '2'
const LIST_ISSUES = '3'
const WORKING_ON_ISSUE_ACTION = '4'
const FIXED_ISSUE_ACTION = '5'

const initialStateButtons = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: 'Report an Issue',
          callback_data: getCallBackData(REPORT_ISSUE_ACTION)
        },
        {
          text: 'List existing issues',
          callback_data: getCallBackData(LIST_ISSUES)
        }
      ]
    ]
  }
}

const registerIssueButton = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: 'Register issue',
          callback_data: getCallBackData(REGISTER_ISSUE_ACTION)
        }
      ]
    ]
  }
}


function getActionButtonsForIssue(issueId){
  return {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Working on it',
            callback_data: getCallBackData(WORKING_ON_ISSUE_ACTION, {issueId})
          },
          {
            text: 'Already fixed',
            callback_data: getCallBackData(FIXED_ISSUE_ACTION, {issueId})
          }
        ]
      ]
    }
  }
}

function getCallBackData(actionId, data){
  return JSON.stringify({ id: actionId, data })
}

bot.on("text", async function(msg){
  var userId = msg.from.id;

  initializeUserState(userId)
  switch(userState[userId].name){
    case REPORTING_ISSUE_STATE:
      userState[userId].issueDescription += msg.text + '\n'
      await bot.sendMessage(msg.from.id, 'You can continue writing the description or register the issue', registerIssueButton)
      break
    default:
      await bot.sendMessage(msg.from.id, 'Hi! What you want to do?', initialStateButtons)
  }
})

bot.on('callback_query', async function(callbackQuery) {
  const action = JSON.parse(callbackQuery.data)
  const actionId = action.id
  const msg = callbackQuery.message
  var userId = msg.chat.id

  initializeUserState(userId)
  switch(actionId){
    case REPORT_ISSUE_ACTION:
      userState[userId].name = REPORTING_ISSUE_STATE
      await bot.sendMessage(msg.chat.id, 'Write a brief description and send an image if you want :)')
    break
    case REGISTER_ISSUE_ACTION:
      await system.registerIssue({id: shortid.generate(), description: userState[userId].issueDescription})
      userState[userId].name = INITIAL_STATE
      userState[userId].issueDescription = ''
      await bot.sendMessage(userId, 'Issue registered! What you want to do now?', initialStateButtons)
    break
    case LIST_ISSUES:
      const issues = await system.getExistingIssues()
      await bot.sendMessage(userId, 'Listing pending issues... ')
      for(var issue of issues){
        await bot.sendMessage(userId, issue.description + 'state: ' + issue.state, getActionButtonsForIssue(issue.id))
      }

      await bot.sendMessage(userId, 'What you want to do now?', initialStateButtons)
    break
    case WORKING_ON_ISSUE_ACTION:
      await system.workingOnIssue(action.data.issueId)
      await bot.sendMessage(userId, 'Issue updated! What you want to do now?', initialStateButtons)
    break
    case FIXED_ISSUE_ACTION:
      await system.fixedIssue(action.data.issueId)
      await bot.sendMessage(userId, 'Issue updated! What you want to do now?', initialStateButtons)
    break
  }
})

function initializeUserState(userId){
  if(!userState[userId]){
    userState[userId] = {name: INITIAL_STATE, issueDescription: ''}
  }
}
