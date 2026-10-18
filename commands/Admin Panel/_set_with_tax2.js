/*CMD
  command: /set_with_tax2
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
if (isNaN(val) || val < 0 || val > 50) {
  Bot.sendMessage("❌ *Invalid percentage!* Please enter a value between 0 and 50.");
  Bot.runCommand("/set_with_tax");
  return;
}

Bot.setProperty("WithdrawTaxPercent", val, "float");
Bot.sendMessage("✅ *Withdrawal Tax has been set to " + val + "%!*");
Bot.runCommand("/fin_settings");
