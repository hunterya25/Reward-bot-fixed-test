/*CMD
  command: /set_deposit_upi
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
var cur = Bot.getProperty("deposit_upi", "vipboy07@ybl");

Api.editMessageText({
  message_id: mm,
  text: "🏦 *Set Deposit Receiving UPI ID*\n\n" +
    "▫️ *Current UPI:* `" + cur + "`\n\n" +
    "👉 _Please send the new UPI ID where users will send deposit payments:_ ",
  parse_mode: "Markdown",
  reply_markup: {
    inline_keyboard: [[{ text: "◀ Back", callback_data: "/bot_info_settings" }]]
  }
});

Bot.runCommand("/set_deposit_upi2");
