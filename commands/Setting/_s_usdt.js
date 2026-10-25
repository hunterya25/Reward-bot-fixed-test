/*CMD
  command: /s_usdt
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

var currentUsdt = User.getProperty("usdt_bep20") || "_None_";

var text = "💎 *Set USDT (BEP20) Wallet Address*\n\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "Current Address: `" + currentUsdt + "`\n\n" +
  "👉 *Please send your USDT (BEP20 / Binance Smart Chain) wallet address:*\n" +
  "_(Must start with `0x` and be 42 characters long from Trust Wallet, Binance, MetaMask, etc.)_\n\n" +
  "⚠️ *STRICT WARNING & DISCLAIMER:*\n" +
  "• Only provide a **USDT (BEP-20 / BNB Smart Chain)** address!\n" +
  "• Do NOT provide TRC20 (Tron), ERC20 (Ethereum), Polygon, or Solana network addresses.\n" +
  "• *If you provide an incorrect address, wrong network, or unsupported exchange address, funds will be permanently lost and WE WILL NOT BE RESPONSIBLE!*\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •";

var inl = [
  [{ text: "🔙 Cancel / Back", callback_data: "/wallet" }]
];

var m = User.getProperty("settingm");
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

Bot.runCommand("/s_usdt2");
