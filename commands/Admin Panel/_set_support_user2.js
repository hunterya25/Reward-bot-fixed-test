/*CMD
  command: /set_support_user2
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

Api.deleteMessage({ chat_id: chat.chatid, message_id: request.message_id });
var adm = Bot.getProperty("adminID");
if (user.telegramid != adm) {
  Bot.sendMessage("⛔️ Access Denied!");
  return;
}

var val = message.trim();
if (!val.startsWith("@")) {
  val = "@" + val;
}

Bot.setProperty("Support_user", val, "string");
Bot.sendMessage("✅ *Customer Support handle has been set to `" + val + "`!*");
Bot.runCommand("/bot_info_settings");
