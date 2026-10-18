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
  Api.sendMessage({
    text: "⚠️ <b>Unable to verify membership at this moment.</b> Please try clicking Verify again in a few seconds.",
    parse_mode: "html"
  });
  return;
}

var memberStatus = options.result.status;
var isJoined = (memberStatus === "member" || memberStatus === "administrator" || memberStatus === "creator" || memberStatus === "restricted");

var reqChannels = Bot.getProperty("RequiredChannels", []);
if (reqChannels && reqChannels.length > 0) {
  reqChannels = reqChannels.filter(function(c) {
    return c && c.toString().trim().length > 1;
  });
}

if (isJoined) {
  var curIdx = User.getProperty("checking_channel_idx", 0);
  if (isNaN(curIdx)) { curIdx = 0; }
  var nextIdx = curIdx + 1;

  // If there are more channels in the list, verify the next channel
  if (reqChannels && nextIdx < reqChannels.length) {
    Bot.runCommand("/check_join " + nextIdx);
    return;
  }

  // All channels successfully verified!
  User.setProperty("channel_joined", true, "boolean");
  User.setProperty("checking_channel_idx", 0, "integer");
  User.setProperty("last_channel_check", new Date().getTime(), "integer");

  // Delete the join prompt message if available
  if (request && request.message && request.message.message_id) {
    Api.deleteMessage({ chat_id: chat.chatid, message_id: request.message.message_id });
  }

  var activeBot = Bot.getProperty("bot_username") || (bot && bot.name) || "Bot";
  activeBot = activeBot.replace("@", "").trim();

  Api.sendMessage({
    text: "🎉 <b>Verification Successful! Welcome to @" + activeBot + "</b> 🚀\n\n<i>You now have full access to all bot features.</i>",
    parse_mode: "html"
  });

  Bot.runCommand("/start");
} else {
  User.setProperty("channel_joined", false, "boolean");

  var curIdx = User.getProperty("checking_channel_idx", 0);
  if (isNaN(curIdx)) { curIdx = 0; }
  User.setProperty("checking_channel_idx", 0, "integer");

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

  var notJoinedChan = (reqChannels && reqChannels[curIdx]) ? reqChannels[curIdx] : "our channel";

  var failText = "⚠️ <b>Channel Membership Required!</b>\n\n" +
    "You have not joined <b>" + notJoinedChan + "</b> yet!\n\n" +
    "📢 <b>Mandatory Channel(s):</b>\n" +
    chanListText + "\n" +
    "🔔 <b>Rules:</b> You must join all channels and remain in them to access the bot.\n\n" +
    "👇 <b>Please join and tap Verify below:</b>";

  if (request && request.message && request.message.message_id) {
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
