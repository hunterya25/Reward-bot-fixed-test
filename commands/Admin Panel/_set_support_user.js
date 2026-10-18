/*CMD
  command: /set_support_user
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
var cur = Bot.getProperty("Support_user", "@vipboy07");

Api.editMessageText({
  message_id: mm,
  text: "📞 *Set Customer Support Username*\n\n" +
    "▫️ *Current Support Handle:* `" + cur + "`\n\n" +
    "👉 _Please send the support username with @ (e.g. `@SupportTeam`):_",
  parse_mode: "Markdown",
  reply_markup: {
    inline_keyboard: [[{ text: "◀ Back", callback_data: "/bot_info_settings" }]]
  }
});

Bot.runCommand("/set_support_user2");
