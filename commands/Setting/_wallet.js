/*CMD
  command: /wallet
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Setting

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var upi = User.getProperty("upi_id") || "_Not Configured_";
var usdt = User.getProperty("usdt_bep20") || "_Not Configured_";

var text = "💼 *Payment & Payout Wallet Settings*\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n\n" +
  "🇮🇳 *UPI ID:* `" + upi + "`\n" +
  "💎 *USDT (BEP20) Address:* `" + usdt + "`\n\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "⚠️ *Crypto Payout Notice:*\n" +
  "For USDT withdrawals, please ensure you only provide a **Binance Smart Chain (BEP20)** address. Do NOT use TRC20, ERC20, or SOL networks.\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n\n" +
  "_Select an option below to configure your payout accounts:_";

var m = User.getProperty("settingm");
var inl = [
  [
    { text: "🇮🇳 Set / Change UPI", callback_data: "/s_wall" }
  ],
  [
    { text: "💎 Set / Change USDT (BEP20)", callback_data: "/s_usdt" }
  ],
  [
    { text: "🔙 Back To Settings", callback_data: "⚙️ Settings" }
  ]
];

if (request && request.message && request.message.message_id) {
  Api.editMessageText({
    message_id: request.message.message_id,
    text: text,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
} else if (m) {
  Api.editMessageText({
    message_id: m,
    text: text,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
} else {
  Api.sendMessage({
    text: text,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
}
