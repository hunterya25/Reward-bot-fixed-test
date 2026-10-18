/*CMD
  command: /set_dep_bonus
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
var cur = Bot.getProperty("DepositBonusPercent", 0);

Api.editMessageText({
  message_id: mm,
  text: "✏️ *Set Deposit Bonus Percentage*\n\n" +
    "▫️ *Current Bonus:* " + cur + "%\n\n" +
    "👉 _Please send the bonus percentage to reward users on depositing (e.g. 0, 5, 10, 20):_",
  parse_mode: "Markdown",
  reply_markup: {
    inline_keyboard: [[{ text: "◀ Back", callback_data: "/fin_settings" }]]
  }
});

Bot.runCommand("/set_dep_bonus2");
