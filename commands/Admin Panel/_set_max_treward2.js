/*CMD
  command: /set_max_treward2
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

if (!isNumeric(message) || parseFloat(message) <= 0) {
  Bot.sendMessage("❌ *Please enter a valid positive amount!*");
  Bot.runCommand("/set_max_treward");
  return;
}

var val = parseFloat(message);
var minReward = Bot.getProperty("MinTaskReward", 0.10);
if (val < minReward) {
  Bot.sendMessage("⚠️ *Maximum reward cannot be less than Minimum reward (`₹" + minReward.toFixed(2) + "`)!*");
  Bot.runCommand("/set_max_treward");
  return;
}

Bot.setProperty("MaxTaskReward", val, "float");
Bot.sendMessage("✅ *Maximum Task Reward set to `₹" + val.toFixed(2) + "`!*");

Bot.runCommand("/task_limits");
