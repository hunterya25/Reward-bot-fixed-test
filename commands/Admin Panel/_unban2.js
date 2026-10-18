/*CMD
  command: /unban2
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
      "*User was Not Found to UnBan!! *\n\nPlease Recheck User's Telegram I'd"
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

  var bnn = Bot.getProperty("Banned_Users", [])
  var newBnn = []
  for (var i in bnn) {
    if (bnn[i] != tgi) {
      newBnn.push(bnn[i])
    }
  }
  Bot.setProperty("Banned_Users", newBnn, "json")
  Bot.setProperty("ban" + tgi, null)
  Bot.unblockChat(us.id)

  Bot.sendMessageToChatWithId(tgi, "🎉 *Your ban has been removed by Administrator! You can now use the bot.*")

  Api.editMessageText({
    message_id: mm,
    text:
      "<b><a href='tg://user?id=" +
      tgi +
      "'>" +
      us.user.first_name +
      "</a> (" + tgi + ") Has Been Unbanned Successfully ✅</>",
    parse_mode: "html",
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [[{ text: "◀ Back", callback_data: "/user_setting" }]]
    }
  })
} else {
  Bot.sendMessage("⛔️ Access Denied!")
}

