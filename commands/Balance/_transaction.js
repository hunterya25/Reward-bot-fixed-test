/*CMD
  command: /transaction
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Balance

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 🗃 transactions
  group: 
CMD*/

var his = Bot.getProperty("history" + user.telegramid)
if (!his) {
  var hi = `*⚙️ Last 20 Transaction*
✨ No Transaction found`
} else {
  var hi = his
}
Bot.sendMessage(hi)

