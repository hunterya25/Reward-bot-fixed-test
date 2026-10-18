/*CMD
  command: /balance
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Balance

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 💰 balance
  group: 
CMD*/

var Balance = Libs.ResourcesLib.userRes("balance")
  .value()
  .toFixed(3);
var Available_For_Payout = Libs.ResourcesLib.userRes("Available_For_Payout")
  .value()
  .toFixed(3);

var inl = [
  [
    { text: "📜 Withdrawal Status & History", callback_data: "/my_withdrawals 1" }
  ],
  [
    { text: "🤑 Withdraw Money", callback_data: "/withdraw" }
  ]
];

var Text = `• ━━━━━━━━━━━━━━━━━ •
<b>🔸️ Aᴠᴀɪʟᴀʙʟᴇ Bᴀʟᴀɴᴄᴇ</b>
<code>${Balance}</code> RS

<b>🔸️ Aᴠᴀɪʟᴀʙʟᴇ Fᴏʀ Pᴀʏᴏᴜᴛ</b>
<code>${Available_For_Payout}</code> RS
• ━━━━━━━━━━━━━━━━━ •

<b>COMPLETE TASK AND INCREASE YOUR BALANCE.🚀💰</b>
• ━━━━━━━━━━━━━━━━━ •`;

if (request.message && request.message.message_id) {
  Api.editMessageText({
    message_id: request.message.message_id,
    text: Text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
} else {
  Api.sendMessage({
    text: Text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
}
