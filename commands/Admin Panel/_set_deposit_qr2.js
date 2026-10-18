/*CMD
  command: /set_deposit_qr2
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
if (!val.startsWith("http://") && !val.startsWith("https://")) {
  Bot.sendMessage("❌ *Invalid URL!* Must start with http:// or https://");
  Bot.runCommand("/set_deposit_qr");
  return;
}

Bot.setProperty("deposit_qr", val, "string");
Bot.sendMessage("✅ *Deposit QR Image URL has been updated!*");
Bot.runCommand("/bot_info_settings");
