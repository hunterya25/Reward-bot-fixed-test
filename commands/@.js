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

var m = Bot.getProperty("maintenance");
var adm = Bot.getProperty("adminID");

// 🚫 Ban Enforcement
var _bb_isBan = Bot.getProperty("ban" + user.telegramid);
if (_bb_isBan == "ban" && user.telegramid != adm) {
  Bot.sendMessage("*🚫 You are banned from using this bot!*\n\n_If you think this is a mistake, contact administration._");
  return;
}

if (m == "✅") {
  if (adm == user.telegramid) {
  } else {
    Bot.sendMessage(
      "*🛠 Maintenance In Progress!*\n\n_▪️ Bot Administration Does Some Technical Work Within This Bot.\n▪️ Due To This Reason, The Menu Was Deactivated By Administrators And Is Not Available At This Time.\n▪️ All Functionality Will Return After Completion Of Maintenance._\n\n*For The Users:*\n_ℹ️ You Can Come Back Later And Press /start To Check The Status Of The Bot._"
    );
    return;
  }
}

// 📢 Mandatory Channel Force-Join Enforcement (Only if channels are configured by admin)
var reqChans = Bot.getProperty("RequiredChannels", []);
if (!reqChans || (reqChans.length === 1 && reqChans[0] === "@BotsByAntares")) {
  reqChans = [];
} else if (reqChans && reqChans.length > 0) {
  reqChans = reqChans.filter(function(c) { return c && c !== "@BotsByAntares"; });
}

if (reqChans && reqChans.length > 0) {
  var incomingText = (message || (request && request.message && request.message.text) || "");
  var callbackData = (request && request.data ? request.data : "");

  var isStartCmd = incomingText.indexOf("/start") === 0;
  var isCheckCmd = incomingText.indexOf("/check_join") === 0 || callbackData.indexOf("/check_join") === 0 || callbackData.indexOf("/on_check_join") === 0;
  var isAdminCmd = incomingText.indexOf("/loginme") === 0 || incomingText.indexOf("/set_admin") === 0 || incomingText.indexOf("/admin") === 0;
  var isAdminUser = (user.telegramid == adm);

  var isExempt = isAdminUser || isStartCmd || isCheckCmd || isAdminCmd;

  if (!isExempt) {
    var isChannelJoined = User.getProperty("channel_joined");
    if (!isChannelJoined) {
      var chanListText = "";
      var joinKeyboard = [];
      for (var ci = 0; ci < reqChans.length; ci++) {
        var chn = reqChans[ci];
        var chnClean = chn.replace("@", "").trim();
        chanListText += "👉 <a href='https://t.me/" + chnClean + "'>" + chn + "</a>\n";
        joinKeyboard.push([{ text: "📢 Join " + chn, url: "https://t.me/" + chnClean }]);
      }
      joinKeyboard.push([{ text: "✅ I Have Joined / Verify", callback_data: "/check_join" }]);

      var joinPrompt = "⚠️ <b>Access Paused — Channel Membership Required!</b>\n\n" +
        "To use this bot and its features, you <b>MUST</b> be a member of our official channel(s):\n\n" +
        chanListText + "\n" +
        "<i>If you leave the channel in the future, bot access will automatically pause until you rejoin!</i>\n\n" +
        "👇 <b>Please join the channel(s) above and tap Verify:</b>";

      Api.sendMessage({
        text: joinPrompt,
        parse_mode: "html",
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: joinKeyboard
        }
      });
      return;
    }

    // Periodic Re-Check (Every 10 minutes)
    var lastCheckTime = User.getProperty("last_channel_check", 0);
    var currentTime = new Date().getTime();
    if (currentTime - lastCheckTime > 10 * 60 * 1000) {
      User.setProperty("last_channel_check", currentTime, "integer");
      Api.getChatMember({
        chat_id: reqChans[0],
        user_id: user.telegramid,
        on_result: "/on_check_join_silent",
        on_error: "/silent_error"
      });
    }
  }
}
