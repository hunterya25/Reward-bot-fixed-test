/*CMD
  command: /set_daily_bonus
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
var cur = Bot.getProperty("DailyBonusAmount", 0.1);

Api.editMessageText({
  message_id: mm,
  text: "✏️ *Set Daily Check-in Bonus Amount*\n\n" +
    "▫️ *Current Bonus:* ₹" + cur + "\n\n" +
    "👉 _Please send the new daily bonus amount in ₹ (e.g. 0.1, 0.5, 1):_",
  parse_mode: "Markdown",
  reply_markup: {
    inline_keyboard: [[{ text: "◀ Back", callback_data: "/ref_settings" }]]
  }
});

Bot.runCommand("/set_daily_bonus2");
