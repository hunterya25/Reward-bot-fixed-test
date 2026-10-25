/*CMD
  command: /set_usdt_rate
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Admin Panel

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var adm = Bot.getProperty("adminID");
if (user.telegramid != adm) {
  Bot.sendMessage("⛔️ Access Denied!");
  return;
}

var currentRate = Bot.getProperty("USDT_INR_Rate", 90);

var text = "💎 *Set USDT to INR Exchange Rate*\n\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "Current Rate: `1 USDT = ₹" + currentRate + "`\n\n" +
  "👉 *Enter the INR value for 1 USDT:* (e.g. `89`, `90`, `92.5`)\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •";

var inl = [
  [{ text: "◀ Cancel", callback_data: "/fin_settings" }]
];

if (request && request.message && request.message.message_id) {
  Api.editMessageText({
    message_id: request.message.message_id,
    text: text,
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: inl }
  });
} else {
  Bot.sendMessage(text, { parse_mode: "Markdown", reply_markup: { inline_keyboard: inl } });
}

Bot.runCommand("/set_usdt_rate2");
