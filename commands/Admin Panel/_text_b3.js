/*CMD
  command: /text_b3
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

Api.deleteMessage({ chat_id: chat.chatid, message_id: request.message_id })
var mm = User.getProperty("adminid")
var fullBotUsers = Bot.getProperty("wholeUsers")
var adm = Bot.getProperty("adminID")
if (adm == user.telegramid) {
  if (request.photo[0]) {
    for (var index in fullBotUsers) {
      var info = fullBotUsers[index]

      if (!request.caption) {
        Api.sendPhoto({ chat_id: info, photo: request.photo[0].file_id })
      }
      if (request.caption) {
        Api.sendPhoto({
          chat_id: info,
          photo: request.photo[0].file_id,
          caption: request.caption,
          parse_mode: "HTML"
        })
      }
    }
  }

  var tto = "*✔️Broadcast Sent To All Active Users*"
  Api.editMessageText({
    message_id: mm,
    text: tto,
    parse_mode: "markdown",
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [[{ text: "◀ Back", callback_data: "/mass_setting" }]]
    }
  })
  return
}

