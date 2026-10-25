/*CMD
  command: /s_usdt2
  help: 
  need_reply: true
  auto_retry_time: 
  folder: Setting

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

if (request && request.message_id) {
  try {
    Api.deleteMessage({ chat_id: chat.chatid, message_id: request.message_id });
  } catch (e) {}
}

var addr = (message || "").trim();

// BEP20 / BSC Address format check (0x followed by 40 hex characters = 42 chars)
var isBEP20 = /^0x[a-fA-F0-9]{40}$/.test(addr);

if (!isBEP20) {
  var errorText = "❌ *Invalid USDT (BEP20) Address Format!*\n\n" +
    "A valid Binance Smart Chain (BEP20) address must:\n" +
    "• Start with `0x`\n" +
    "• Be exactly 42 characters long\n" +
    "• Contain only letters and numbers\n\n" +
    "_(Example: `0x71C...3984`)_\n\n" +
    "⚠️ *Please check your Trust Wallet / Binance BEP20 address and try sending again:*";

  Bot.sendMessage(errorText, { parse_mode: "Markdown" });
  Bot.runCommand("/s_usdt2");
  return;
}

User.setProperty("usdt_bep20", addr, "string");

var successText = "✅ *USDT (BEP20) Wallet Address Saved!* 🎉\n\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "💎 *Registered Address:*\n`" + addr + "`\n\n" +
  "🌐 *Network:* Binance Smart Chain (BEP20 / BSC)\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "⚠️ _Important: If you ever change wallets, remember to update this address before placing a withdrawal!_";

var inl = [
  [{ text: "🔄 Change Address", callback_data: "/s_usdt" }],
  [{ text: "🔙 Back To Wallet Settings", callback_data: "/wallet" }]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: successText,
  parse_mode: "Markdown",
  disable_web_page_preview: true,
  reply_markup: { inline_keyboard: inl }
});
