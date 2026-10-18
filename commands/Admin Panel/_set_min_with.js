/*CMD
  command: /set_min_with
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
var cur = Bot.getProperty("MinWithdrawAmount", 1);

Api.editMessageText({
  message_id: mm,
  text: "✏️ *Set Minimum Withdrawal Amount*\n\n" +
    "▫️ *Current Minimum:* ₹" + cur + "\n\n" +
    "👉 _Please send the new minimum withdrawal amount in ₹ (Numbers only):_",
  parse_mode: "Markdown",
  reply_markup: {
    inline_keyboard: [[{ text: "◀ Back", callback_data: "/fin_settings" }]]
  }
});

Bot.runCommand("/set_min_with2");
