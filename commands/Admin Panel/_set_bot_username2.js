/*CMD
  command: /set_bot_username2
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

var val = message.trim().replace("@", "");
if (val.length < 3) {
  Bot.sendMessage("❌ *Invalid username!*");
  Bot.runCommand("/set_bot_username");
  return;
}

Bot.setProperty("bot_username", val, "string");
Bot.sendMessage("✅ *Bot Telegram Username has been set to `@" + val + "`!* All referral links will now use this username.");
Bot.runCommand("/bot_info_settings");
