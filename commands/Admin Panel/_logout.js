/*CMD
  command: /logout
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Admin Panel

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var mm = User.getProperty("adminid");
if (request.message_id) {
  Api.deleteMessage({ chat_id: chat.chatid, message_id: request.message_id });
}
if (mm) {
  Api.deleteMessage({ chat_id: chat.chatid, message_id: mm });
}

Bot.sendMessage("🔒 *You have logged out of the Admin Panel successfully.*\n\n_To log back in anytime, run /admin_");
