/*CMD
  command: /transaction
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Balance

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 🗃 transactions
  group: 
CMD*/

var his = Bot.getProperty("history" + user.telegramid);
if (!his) {
  var hi = "*⚙️ Last 20 Transactions*\n✨ No Transactions found.";
} else {
  var hi = his;
}

var inl = [
  [{ text: "📜 Detailed Withdrawal Status & Tracking", callback_data: "/my_withdrawals 1" }],
  [{ text: "💰 View Balance", callback_data: "/balance" }]
];

Api.sendMessage({
  text: hi,
  parse_mode: "Markdown",
  disable_web_page_preview: true,
  reply_markup: { inline_keyboard: inl }
});

