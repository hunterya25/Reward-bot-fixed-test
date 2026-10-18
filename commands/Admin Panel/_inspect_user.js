/*CMD
  command: /inspect_user
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

Api.editMessageText({
  message_id: mm,
  text: "🔍 *Deep User Profile Inspector*\n\n" +
    "👉 _Send the Telegram ID of the user you want to inspect:_",
  parse_mode: "Markdown",
  reply_markup: {
    inline_keyboard: [[{ text: "◀ Back", callback_data: "/user_setting" }]]
  }
});

Bot.runCommand("/inspect_user2");
