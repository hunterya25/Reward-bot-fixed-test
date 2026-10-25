/*CMD
  command: /cancel_with
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Withdrawal

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

if (request && request.id) {
  Api.answerCallbackQuery({
    callback_query_id: request.id,
    text: "Withdrawal cancelled"
  });
}

User.deleteProperty("temp_withdraw_data");
User.deleteProperty("current_with_method");

var balance = Libs.ResourcesLib.userRes("Available_For_Payout").value();

var cancelText = "❌ *Withdrawal Cancelled*\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "Your withdrawal request was aborted.\n" +
  "🛡 *No balance was deducted from your account.*\n\n" +
  "💰 *Available For Payout:* `₹" + balance.toFixed(2) + "`\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "You can request a withdrawal anytime from the menu.";

var backInl = [
  [
    { text: "🤑 Withdraw Again", callback_data: "/withdraw" },
    { text: "💰 My Balance", callback_data: "/balance" }
  ]
];

if (request && request.message && request.message.message_id) {
  Api.editMessageText({
    message_id: request.message.message_id,
    text: cancelText,
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: backInl }
  });
} else {
  Api.sendMessage({
    text: cancelText,
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: backInl }
  });
}
