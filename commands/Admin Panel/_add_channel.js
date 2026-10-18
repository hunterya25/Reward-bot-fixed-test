/*CMD
  command: /add_channel
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
  text: "📢 *Add New Mandatory Channel*\n\n" +
    "👉 _Send the channel username with @ (e.g. `@BotsByAntares` or `@MyChannel`):_\n\n" +
    "⚠️ *Note:* Bot must be an Administrator in the channel with member viewing permissions!",
  parse_mode: "Markdown",
  reply_markup: {
    inline_keyboard: [[{ text: "◀ Back", callback_data: "/chan_settings" }]]
  }
});

Bot.runCommand("/add_channel2");
