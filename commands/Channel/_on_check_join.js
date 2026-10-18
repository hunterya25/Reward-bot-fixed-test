/*CMD
  command: /on_check_join
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Channel

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

if (!options || !options.result) {
  Bot.sendMessage("⚠️ Unable to verify membership at this moment. Please try again.");
  return;
}

var memberStatus = options.result.status;
var isJoined = (memberStatus === "member" || memberStatus === "administrator" || memberStatus === "creator" || memberStatus === "restricted");

if (isJoined) {
  User.setProperty("channel_joined", true, "boolean");
  User.setProperty("last_channel_check", new Date().getTime(), "integer");

  if (request.message && request.message.message_id) {
    Api.deleteMessage({ chat_id: chat.chatid, message_id: request.message.message_id });
  }

  Bot.sendMessage("🎉 *Verification Successful! Welcome to @" + bot.name + "* 🚀\n\n_You now have full access to all bot features._", { parse_mode: "Markdown" });
  Bot.runCommand("/start");
} else {
  User.setProperty("channel_joined", false, "boolean");

  var failText = "⚠️ *Channel Membership Required!*\n\n" +
    "You have *NOT* joined our official channel yet, or you left it!\n\n" +
    "📢 *Mandatory Channel:*\n" +
    "👉 https://t.me/BotsByAntares (`@BotsByAntares`)\n\n" +
    "🔔 *Rules:* You must remain in this channel. If you leave at any time in the future, bot access will be paused until you rejoin!\n\n" +
    "👇 *Join the channel and click Verify below:*";

  var inl = [
    [{ text: "📢 Join @BotsByAntares", url: "https://t.me/BotsByAntares" }],
    [{ text: "✅ I Have Joined / Verify", callback_data: "/check_join" }]
  ];

  if (request.message && request.message.message_id) {
    Api.editMessageText({
      message_id: request.message.message_id,
      text: failText,
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      reply_markup: { inline_keyboard: inl }
    });
  } else {
    Bot.sendInlineKeyboard(inl, failText);
  }
}
