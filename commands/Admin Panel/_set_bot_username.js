/*CMD
  command: /set_bot_username
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
var cur = Bot.getProperty("bot_username", "backuppro123bot");

Api.editMessageText({
  message_id: mm,
  text: "🤖 *Set Bot Telegram Username*\n\n" +
    "▫️ *Current Username:* `@" + cur + "`\n\n" +
    "👉 _Please send the exact Telegram username of this bot (e.g. `@backuppro123bot`):_",
  parse_mode: "Markdown",
  reply_markup: {
    inline_keyboard: [[{ text: "◀ Back", callback_data: "/bot_info_settings" }]]
  }
});

Bot.runCommand("/set_bot_username2");
