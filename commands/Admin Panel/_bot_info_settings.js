/*CMD
  command: /bot_info_settings
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

var mm = User.getProperty("adminid");
var adm = Bot.getProperty("adminID");

if (adm != user.telegramid) {
  Bot.sendMessage("⛔️ Access Denied!");
  return;
}

var curUpi = Bot.getProperty("deposit_upi", "vipboy07@ybl");
var curQr = Bot.getProperty("deposit_qr", "https://files.catbox.moe/by7c0i.jpg");
var curSupport = Bot.getProperty("Support_user", "@vipboy07");
var curBotUser = Bot.getProperty("bot_username", "backuppro123bot");

var text = "ℹ️ *Bot Configuration & Deposit Receiving Setup*\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n\n" +
  "🤖 *Bot Telegram Username:*\n" +
  "`@" + curBotUser + "`\n\n" +
  "🏦 *Deposit Receiving UPI ID:*\n" +
  "`" + curUpi + "`\n\n" +
  "🖼 *Deposit QR Code Image Link:*\n" +
  "`" + curQr + "`\n\n" +
  "📞 *Customer Support Username:*\n" +
  "`" + curSupport + "`\n\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "_Select any field below to update:_";

var inl = [
  [
    { text: "🤖 Set Bot Username (@" + curBotUser + ")", callback_data: "/set_bot_username" }
  ],
  [
    { text: "✏️ Set Deposit UPI ID", callback_data: "/set_deposit_upi" },
    { text: "✏️ Set Deposit QR URL", callback_data: "/set_deposit_qr" }
  ],
  [
    { text: "✏️ Set Support Username", callback_data: "/set_support_user" }
  ],
  [
    { text: "◀ Back To Panel", callback_data: "/admin" }
  ]
];

if (mm) {
  Api.editMessageText({
    message_id: mm,
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
