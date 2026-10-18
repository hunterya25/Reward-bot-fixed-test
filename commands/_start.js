/*CMD
  command: /start
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: ⬅️ return
  group: 
CMD*/

var admin = Bot.getProperty("admin_chat");
var adm = Bot.getProperty("adminID");

if (!admin) {
  Bot.sendMessage(
    "⛔️ *Bot Has No Admin*\n\n_Run_ `/loginme` _or_ `/set_admin` _to configure administrator access._"
  );
  return;
}

// Track unique users
var fullBotUsers = Bot.getProperty("wholeUsers", []);
var already = User.getProperty("already" + user.telegramid);
var isFirstTimeUser = !already;
if (!already) {
  fullBotUsers.push(user.telegramid);
  Bot.setProperty("wholeUsers", fullBotUsers, "json");
  User.setProperty("already" + user.telegramid, user.telegramid, "text");
}
Bot.setProperty("Chat" + user.telegramid, chat, "json");

// Auto-detect Telegram Bot Username
if (!Bot.getProperty("bot_username")) {
  Api.getMe({ on_result: "/on_get_me" });
}

// 🤝 DIRECT REFERRAL TRACKING
// Extract referral ID from deep link (e.g. /start 8669173066 or /start user8669173066)
var rawRef = params ? params.trim() : "";
if (!rawRef && message && message.indexOf("/start ") === 0) {
  rawRef = message.replace("/start ", "").trim();
}
rawRef = rawRef.replace(/^user/i, "").replace(/^ref/i, "").trim();

if (rawRef) {
  if (rawRef === user.telegramid.toString()) {
    Bot.sendMessage("❌ *You cannot click your own referral link!*", { parse_mode: "Markdown" });
  } else if (isFirstTimeUser && !User.getProperty("referrerId")) {
    User.setProperty("pending_referrer", rawRef, "string");
  }
}

// Auto-clean old default Antares channel
var reqChans = Bot.getProperty("RequiredChannels", []);
if (!reqChans || (reqChans.length === 1 && reqChans[0] === "@BotsByAntares")) {
  reqChans = [];
  Bot.setProperty("RequiredChannels", [], "json");
} else if (reqChans && reqChans.length > 0) {
  var cleaned = reqChans.filter(function(c) { return c && c !== "@BotsByAntares"; });
  if (cleaned.length !== reqChans.length) {
    reqChans = cleaned;
    Bot.setProperty("RequiredChannels", reqChans, "json");
  }
}

// 📢 Mandatory Channel Force-Join Check
var isJoined = User.getProperty("channel_joined");
if (reqChans && reqChans.length > 0 && user.telegramid != adm && !isJoined) {
  var chanListText = "";
  var joinKeyboard = [];
  for (var cj = 0; cj < reqChans.length; cj++) {
    var cName = reqChans[cj];
    var cClean = cName.replace("@", "").trim();
    chanListText += "👉 <a href='https://t.me/" + cClean + "'>" + cName + "</a>\n";
    joinKeyboard.push([{ text: "📢 Join " + cName, url: "https://t.me/" + cClean }]);
  }
  joinKeyboard.push([{ text: "✅ I Have Joined / Verify", callback_data: "/check_join" }]);

  var activeBotName = Bot.getProperty("bot_username") || (bot && bot.name) || "Bot";
  activeBotName = activeBotName.replace("@", "").trim();

  var joinPrompt = "👋 <b>Welcome to @" + activeBotName + "!</b> 🚀\n\n" +
    "⚠️ <b>Mandatory Step To Start:</b>\n" +
    "To use this bot and start earning UPI cash, you <b>MUST</b> join our official channel(s):\n\n" +
    chanListText + "\n" +
    "<i>If you leave the channel in the future, bot access will be paused until you rejoin!</i>\n\n" +
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

// Silently verify channel in background for existing members
if (reqChans && reqChans.length > 0 && user.telegramid != adm) {
  Api.getChatMember({
    chat_id: reqChans[0],
    user_id: user.telegramid,
    on_result: "/on_check_join_silent",
    on_error: "/silent_error"
  });
}

// 🤝 Process Referral Attribution (Runs once user passes checks)
var pendingRef = User.getProperty("pending_referrer");
var alreadyReferred = User.getProperty("referrerId");

if (pendingRef && !alreadyReferred && pendingRef !== user.telegramid.toString()) {
  var refId = pendingRef;
  User.setProperty("referrerId", refId, "string");
  Bot.setProperty("UserReferrer_" + user.telegramid, refId, "string");

  var refs = Bot.getProperty("UserReferrals_" + refId, []);
  if (!refs) { refs = []; }

  var alreadyInList = false;
  for (var ri = 0; ri < refs.length; ri++) {
    if (refs[ri].id == user.telegramid) {
      alreadyInList = true;
      break;
    }
  }

  if (!alreadyInList) {
    var nowTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    refs.unshift({
      id: user.telegramid,
      name: user.first_name || "User",
      username: user.username || "",
      joined: nowTime,
      tasks_completed: 0,
      total_earned: 0
    });
    Bot.setProperty("UserReferrals_" + refId, refs, "json");

    // Increment referrer total referrals count
    var refCountRes = Libs.ResourcesLib.anotherUserRes("total_referrals", refId);
    refCountRes.add(1);

    var refComm = Bot.getProperty("ReferralTaskCommission", 0.5);
    var refChat = Bot.getProperty("Chat" + refId);
    var refChatTarget = (refChat && refChat.chatid) ? refChat.chatid : refId;

    var nameDisplay = user.first_name ? user.first_name : "New User";
    var userLink = user.username ? ("@" + user.username) : ("<a href='tg://user?id=" + user.telegramid + "'>" + nameDisplay + "</a>");

    Api.sendMessage({
      chat_id: refChatTarget,
      text:
        "🔋 <b>You Got a New Referral!</b> 🎉\n\n" +
        "👤 <b>Member:</b> " + userLink + "\n" +
        "🆔 <b>User ID:</b> <code>" + user.telegramid + "</code>\n" +
        "💎 <b>Reward Rate:</b> <b>₹" + refComm.toFixed(2) + "</b> for every task they complete (Lifetime)!\n\n" +
        "📈 <i>Keep sharing your referral link to earn more!</i>",
      parse_mode: "html",
      disable_web_page_preview: true
    });
  }
  User.setProperty("pending_referrer", null);
}

// 📱 Main Menu Keyboard
var currentBotName = Bot.getProperty("bot_username") || (bot && bot.name) || "Reward Boy";
currentBotName = currentBotName.replace("@", "").trim();

Bot.sendKeyboard(
  "💰 Balance,🏟 My Tasks\n👨‍💻 Tasks,⚙️ Settings,🤑 Withdraw\n🤝 Refer & Earn,➕ Deposit\n📞 Support,📝How To Use\n📋 Create Task",
  "*👋 Hey, Welcome To @" +
    currentBotName +
    " Task Manager !*\n\n⛅️ _You Can Complete Here Task And Earn UPI CASH And Here You Can Create A Task And Promote Your Social Platforms._\n\n*🐼 You Can Earn A Lot Of Money From Here Just Complete The Task..*"
);

// Admin notification for new registration
if (!User.getProperty("UserDone")) {
  User.setProperty("UserDone", true, "boolean");
  var stat = Libs.ResourcesLib.anotherChatRes("status", "global");
  stat.add(1);
  if (adm) {
    var adminUserLink = "<a href='tg://user?id=" + user.telegramid + "'>" + (user.first_name || "User") + "</a>";
    Api.sendMessage({
      chat_id: adm,
      text:
        "➕ <b>New User Notification</b> ➕\n\n" +
        "👤 <b>User:</b> " + adminUserLink + (user.username ? " (@" + user.username + ")" : "") + "\n\n" +
        "🆔 <b>User ID:</b> <code>" + user.telegramid + "</code>\n\n" +
        "🌝 <b>Total Users Count: " + stat.value() + "</b>",
      parse_mode: "html",
      disable_web_page_preview: true
    });
  }
}
