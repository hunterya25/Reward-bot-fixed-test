/*CMD
  command: /set_with_tax
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
var cur = Bot.getProperty("WithdrawTaxPercent", 0);

Api.editMessageText({
  message_id: mm,
  text: "✏️ *Set Withdrawal Fee / Tax Percentage*\n\n" +
    "▫️ *Current Tax:* " + cur + "%\n\n" +
    "👉 _Please send the tax percentage to deduct on withdrawals (e.g. 0, 2, 5, 10):_",
  parse_mode: "Markdown",
  reply_markup: {
    inline_keyboard: [[{ text: "◀ Back", callback_data: "/fin_settings" }]]
  }
});

Bot.runCommand("/set_with_tax2");
