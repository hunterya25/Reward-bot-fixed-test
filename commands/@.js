/*CMD
  command: @
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var m = Bot.getProperty("maintenance")
var adm = Bot.getProperty("adminID")

// 🚫 Ban Enforcement
var _bb_isBan = Bot.getProperty("ban" + user.telegramid)
if (_bb_isBan == "ban" && user.telegramid != adm) {
  Bot.sendMessage("*🚫 You are banned from using this bot!*\n\n_If you think this is a mistake, contact administration._")
  return
}

if (m == "✅") {
  if (adm == user.telegramid) {
  } else {
    Bot.sendMessage(
      "*🛠 Maintenance In Progress!*\n\n_▪️ Bot Administration Does Some Technical Work Within This Bot.\n▪️ Due To This Reason, The Menu Was Deactivated By Administrators And Is Not Available At This Time.\n▪️ All Functionality Will Return After Completion Of Maintenance._\n\n*For The Users:*\n_ℹ️ You Can Come Back Later And Press /start To Check The Status Of The Bot._"
    )
    return
  }
}

