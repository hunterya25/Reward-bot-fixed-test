/*CMD
  command: /set_deposit_upi2
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
if (!val.includes("@") || val.length < 5) {
  Bot.sendMessage("❌ *Invalid UPI ID!* Make sure it contains '@' (e.g. `example@upi`).");
  Bot.runCommand("/set_deposit_upi");
  return;
}

Bot.setProperty("deposit_upi", val, "string");
Bot.sendMessage("✅ *Deposit UPI ID has been updated to `" + val + "`!*");
Bot.runCommand("/bot_info_settings");
