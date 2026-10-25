/*CMD
  command: /set_min_usdt
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

var currentMin = Bot.getProperty("MinWithdrawUSDT", 1);
var rate = Bot.getProperty("USDT_INR_Rate", 90);

var text = "💎 *Set Minimum USDT Withdrawal Limit*\n\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "Current Min: `" + currentMin + " USDT` (~₹" + (currentMin * rate).toFixed(2) + ")\n\n" +
  "👉 *Enter the minimum USDT withdrawal amount:* (e.g. `1`, `2`, `5`)\n" +
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

Bot.runCommand("/set_min_usdt2");
