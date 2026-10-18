/*CMD
  command: /set_daily_bonus2
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

var val = parseFloat(message);
if (isNaN(val) || val < 0) {
  Bot.sendMessage("❌ *Invalid number!* Please enter a positive number or 0.");
  Bot.runCommand("/set_daily_bonus");
  return;
}

Bot.setProperty("DailyBonusAmount", val, "float");
Bot.sendMessage("✅ *Daily Check-in Bonus has been set to ₹" + val.toFixed(2) + "!*");
Bot.runCommand("/ref_settings");
