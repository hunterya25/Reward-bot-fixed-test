/*CMD
  command: /history2
  help: 
  need_reply: true
  auto_retry_time: 
  folder: Admin Panel

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var adm = Bot.getProperty("adminID")
var mm = User.getProperty("adminid")
Api.deleteMessage({ chat_id: chat.chatid, message_id: request.message_id })
if (user.telegramid == adm) {
  var tgi = message
  var us = Bot.getProperty("Chat" + message + "", "null")
  if (us == "null") {
    var tti =
      "*User was Not Found to History!! *\n\nPlease Recheck User's Telegram I'd"
    Api.editMessageText({
      message_id: mm,
      text: tti,
      parse_mode: "markdown",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [[{ text: "◀ Back", callback_data: "/user_setting" }]]
      }
    })
    return
  }
  var his = Bot.getProperty("history" + message)
  if (!his) {
    var hi = `*⚙️ Last 20 Transaction*
✨ No Transaction found`
  } else {
    var hi = his
  }
  Api.editMessageText({
    message_id: mm,
    text: hi,
    parse_mode: "markdown",
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [[{ text: "◀ Back", callback_data: "/user_setting" }]]
    }
  })
  return
}

