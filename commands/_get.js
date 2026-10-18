/*CMD
  command: /get
  help: 
  need_reply: true
  auto_retry_time: 
  folder: 
  answer: BB Mail 💌💌📬

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

//Clone Code Started
if (user.telegramid != "7817449994") {
    Bot.sendMessage("")
    return
  }
if (Bot.getProperty("ban" + user.telegramid) == user.telegramid) {
  Bot.sendMessage("you are ban")
  return
}
BBAdmin.installBot({
  email: message,
  bot_id: bot.id
})
Bot.sendMessage(
  "Sucess Bot Sent"
)
