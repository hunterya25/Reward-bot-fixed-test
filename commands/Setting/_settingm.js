/*CMD
  command: /settingm
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Setting

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

Bot.setProperty("taskalert" + user.telegramid, "🔕")
var nn = Bot.getProperty("taskalert" + user.telegramid)
var m = User.getProperty("settingm")
var inl = [
  [{ text: "" + nn + " New Task Alert", callback_data: "/settinm" }],
  [{ text: "🗂 Wallet", callback_data: "/wallet " }]
]
var txt = "* Choose A Setting To Edit Below:*"
Api.editMessageText({
  message_id: m,
  text: txt,
  parse_mode: "markdown",
  disable_web_page_preview: true,
  reply_markup: { inline_keyboard: inl }
})

