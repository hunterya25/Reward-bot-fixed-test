/*CMD
  command: /set_ref_comm2
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
  Bot.runCommand("/set_ref_comm");
  return;
}

Bot.setProperty("ReferralTaskCommission", val, "float");
Bot.sendMessage("✅ *Referral Task Commission has been set to ₹" + val.toFixed(2) + " per task!*");
Bot.runCommand("/ref_settings");
