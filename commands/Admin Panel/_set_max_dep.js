/*CMD
  command: /set_max_dep
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
var cur = Bot.getProperty("MaxDepositAmount", 10000);

Api.editMessageText({
  message_id: mm,
  text: "✏️ *Set Maximum Deposit Limit*\n\n" +
    "▫️ *Current Maximum:* ₹" + cur + "\n\n" +
    "👉 _Please send the new maximum deposit limit in ₹ (Numbers only):_",
  parse_mode: "Markdown",
  reply_markup: {
    inline_keyboard: [[{ text: "◀ Back", callback_data: "/fin_settings" }]]
  }
});

Bot.runCommand("/set_max_dep2");
