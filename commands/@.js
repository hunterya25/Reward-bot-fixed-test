/*CMD
  command: @
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var m = Bot.getProperty("maintenance")
var adm = Bot.getProperty("adminID")

// 🚫 Ban Enforcement
var _bb_isBan = Bot.getProperty("ban" + user.telegramid)
if (_bb_isBan == "ban" && user.telegramid != adm) {
  Bot.sendMessage("*🚫 You are banned from using this bot!*\n\n_If you think this is a mistake, contact administration._")
  return
}

if (m == "✅") {
  if (adm == user.telegramid) {
  } else {
    Bot.sendMessage(
      "*🛠 Maintenance In Progress!*\n\n_▪️ Bot Administration Does Some Technical Work Within This Bot.\n▪️ Due To This Reason, The Menu Was Deactivated By Administrators And Is Not Available At This Time.\n▪️ All Functionality Will Return After Completion Of Maintenance._\n\n*For The Users:*\n_ℹ️ You Can Come Back Later And Press /start To Check The Status Of The Bot._"
    )
    return
  }
}

// 📢 Mandatory Channel Force-Join Enforcement
var isExempt = (user.telegramid == adm) ||
  (message && (message.indexOf("/check_join") === 0 || message.indexOf("/start") === 0 || message.indexOf("/loginme") === 0)) ||
  (request && request.data && (request.data.indexOf("/check_join") === 0 || request.data.indexOf("/on_check_join") === 0));

if (!isExempt) {
  var isChannelJoined = User.getProperty("channel_joined");
  if (!isChannelJoined) {
    var joinPrompt = "⚠️ *Access Paused — Channel Membership Required!*\n\n" +
      "To use this bot and its features, you *MUST* be a member of our official channel:\n" +
      "📢 https://t.me/BotsByAntares (`@BotsByAntares`)\n\n" +
      "_If you leave the channel in the future, bot access will automatically pause until you rejoin!_\n\n" +
      "👇 *Please join now and click Verify below:*";

    var joinKeyboard = [
      [{ text: "📢 Join @BotsByAntares", url: "https://t.me/BotsByAntares" }],
      [{ text: "✅ I Have Joined / Verify", callback_data: "/check_join" }]
    ];

    Bot.sendInlineKeyboard(joinKeyboard, joinPrompt);
    return;
  }

  // Periodic Re-Check (Every 10 minutes) to catch users who left the channel
  var lastCheckTime = User.getProperty("last_channel_check", 0);
  var currentTime = new Date().getTime();
  if (currentTime - lastCheckTime > 10 * 60 * 1000) {
    User.setProperty("last_channel_check", currentTime, "integer");
    var reqChans = Bot.getProperty("RequiredChannels", ["@BotsByAntares"]);
    var ch = (reqChans && reqChans.length > 0) ? reqChans[0] : "@BotsByAntares";
    Api.getChatMember({
      chat_id: ch,
      user_id: user.telegramid,
      on_result: "/on_check_join_silent"
    });
  }
}

