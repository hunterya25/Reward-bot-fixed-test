/*CMD
  command: /set_min_tusers2
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

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

if (!isNumeric(message) || parseInt(message) <= 0) {
  Bot.sendMessage("❌ *Please enter a valid positive number!*");
  Bot.runCommand("/set_min_tusers");
  return;
}

var val = parseInt(message);
Bot.setProperty("MinTaskUsers", val, "integer");
Bot.sendMessage("✅ *Minimum Users Per Task set to `" + val + "` users!*");

Bot.runCommand("/task_limits");
