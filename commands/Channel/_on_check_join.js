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

var reqChannels = Bot.getProperty("RequiredChannels", []);
if (!reqChannels || (reqChannels.length === 1 && reqChannels[0] === "@BotsByAntares")) {
  reqChannels = [];
} else if (reqChannels && reqChannels.length > 0) {
  reqChannels = reqChannels.filter(function(c) { return c && c !== "@BotsByAntares"; });
}

if (isJoined) {
  var curIdx = (options && options.channelIdx) ? options.channelIdx : 0;
  var nextIdx = curIdx + 1;

  // If there are more channels to verify, check the next one
  if (reqChannels && nextIdx < reqChannels.length) {
    Bot.run({
      command: "/check_join",
      options: { channelIdx: nextIdx }
    });
    return;
  }

  // All channels verified!
  User.setProperty("channel_joined", true, "boolean");
  User.setProperty("last_channel_check", new Date().getTime(), "integer");

  if (request.message && request.message.message_id) {
    Api.deleteMessage({ chat_id: chat.chatid, message_id: request.message.message_id });
  }

  var activeBot = Bot.getProperty("bot_username") || (bot && bot.name) || "Bot";
  activeBot = activeBot.replace("@", "").trim();
  Bot.sendMessage("🎉 <b>Verification Successful! Welcome to @" + activeBot + "</b> 🚀\n\n<i>You now have full access to all bot features.</i>", { parse_mode: "html" });
  Bot.runCommand("/start");
} else {
  User.setProperty("channel_joined", false, "boolean");

  if (!reqChannels || reqChannels.length === 0) {
    User.setProperty("channel_joined", true, "boolean");
    Bot.runCommand("/start");
    return;
  }

  var chanListText = "";
  var inl = [];
  for (var i = 0; i < reqChannels.length; i++) {
    var ch = reqChannels[i];
    var chClean = ch.replace("@", "").trim();
    chanListText += "👉 <a href='https://t.me/" + chClean + "'>" + ch + "</a>\n";
    inl.push([{ text: "📢 Join " + ch, url: "https://t.me/" + chClean }]);
  }
  inl.push([{ text: "✅ I Have Joined / Verify", callback_data: "/check_join" }]);

  var failText = "⚠️ <b>Channel Membership Required!</b>\n\n" +
    "You have <b>NOT</b> joined our official channel(s) yet, or you left!\n\n" +
    "📢 <b>Mandatory Channel(s):</b>\n" +
    chanListText + "\n" +
    "🔔 <b>Rules:</b> You must remain in these channels. If you leave at any time in the future, bot access will be paused until you rejoin!\n\n" +
    "👇 <b>Please join and tap Verify below:</b>";

  if (request.message && request.message.message_id) {
    Api.editMessageText({
      message_id: request.message.message_id,
      text: failText,
      parse_mode: "html",
      disable_web_page_preview: true,
      reply_markup: { inline_keyboard: inl }
    });
  } else {
    Api.sendMessage({
      text: failText,
      parse_mode: "html",
      disable_web_page_preview: true,
      reply_markup: { inline_keyboard: inl }
    });
  }
}
