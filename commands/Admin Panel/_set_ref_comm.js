/*CMD
  command: /set_ref_comm
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
var cur = Bot.getProperty("ReferralTaskCommission", 0.5);

Api.editMessageText({
  message_id: mm,
  text: "✏️ *Set Referral Commission Per Task*\n\n" +
    "▫️ *Current Commission:* ₹" + cur + " per task\n\n" +
    "👉 _Please send the new commission in ₹ (e.g. 0.5, 1, 2):_",
  parse_mode: "Markdown",
  reply_markup: {
    inline_keyboard: [[{ text: "◀ Back", callback_data: "/ref_settings" }]]
  }
});

Bot.runCommand("/set_ref_comm2");
