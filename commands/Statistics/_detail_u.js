/*CMD
  command: /detail_u
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Statistics

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

Api.deleteMessage({ message_id: request.message.message_id })
var fullBotUsers = Bot.getProperty("wholeUsers")
for (var index in fullBotUsers) {
  var info = fullBotUsers[index]
  var us = Bot.getProperty("Chat" + info + "", "null")
  var il = us.user.first_name
  var tto =
    "*👤 Name:* " +
    il +
    "\n🆔* Telegram ID:* `" +
    info +
    "`\n💤* User Id:* `" +
    us.user.id +
    "`\n*😇 Chat:* " +
    us.chat_type +
    "\n🎷* Joined Bot:* " +
    us.created_at +
    ""
  Bot.sendMessage(tto)
}

