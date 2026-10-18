/*CMD
  command: /set_min_dep2
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
if (isNaN(val) || val <= 0) {
  Bot.sendMessage("❌ *Invalid number!* Please enter a positive number.");
  Bot.runCommand("/set_min_dep");
  return;
}

Bot.setProperty("MinDepositAmount", val, "float");
Bot.sendMessage("✅ *Minimum Deposit Amount has been set to ₹" + val.toFixed(2) + "!*");
Bot.runCommand("/fin_settings");
