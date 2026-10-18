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

  var activeBot = Bot.getProperty("bot_username") || (bot && bot.name) || "Bot";
  activeBot = activeBot.replace("@", "");
  Bot.sendMessage("🎉 *Verification Successful! Welcome to @" + activeBot + "* 🚀\n\n_You now have full access to all bot features._", { parse_mode: "Markdown" });
  Bot.runCommand("/start");
} else {
  User.setProperty("channel_joined", false, "boolean");

  var reqChannels = Bot.getProperty("RequiredChannels", []);
  if (!reqChannels || (reqChannels.length === 1 && reqChannels[0] === "@BotsByAntares")) {
    reqChannels = [];
  } else if (reqChannels && reqChannels.length > 0) {
    reqChannels = reqChannels.filter(function(c) { return c && c !== "@BotsByAntares"; });
  }
  if (!reqChannels || reqChannels.length === 0) {
    User.setProperty("channel_joined", true, "boolean");
    Bot.runCommand("/start");
    return;
  }

  var chanListText = "";
  var inl = [];
  for (var i = 0; i < reqChannels.length; i++) {
    var ch = reqChannels[i];
    var chClean = ch.replace("@", "");
    chanListText += "👉 [" + ch + "](https://t.me/" + chClean + ")\n";
    inl.push([{ text: "📢 Join " + ch, url: "https://t.me/" + chClean }]);
  }
  inl.push([{ text: "✅ I Have Joined / Verify", callback_data: "/check_join" }]);

  var failText = "⚠️ *Channel Membership Required!*\n\n" +
    "You have *NOT* joined our official channel(s) yet, or you left!\n\n" +
    "📢 *Mandatory Channel(s):*\n" +
    chanListText + "\n" +
    "🔔 *Rules:* You must remain in these channels. If you leave at any time in the future, bot access will be paused until you rejoin!\n\n" +
    "👇 *Join and click Verify below:*";

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
