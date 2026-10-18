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

var admin = Bot.getProperty("admin_chat")
if (!admin) {
  Bot.sendMessage(
    "⛔️ *Bot Has No Admin*\n\n_Search_ `/loginme` _Command In Your BB Account Which Is Cointaining This Bot and Change The TelegramID In The BJS To Yours After Run The Command,_ `/loginme` _In Bot To Be Admin Then_ `/start`"
  )
  return
}
var fullBotUsers = Bot.getProperty("wholeUsers", [])
var already = User.getProperty("already" + user.telegramid)
if (!already) {
  fullBotUsers.push(user.telegramid)
  Bot.setProperty("wholeUsers", fullBotUsers, "json")
  User.setProperty("already" + user.telegramid, user.telegramid, "text")
}
Bot.setProperty("Chat" + user.telegramid, chat, "json")
var adm = Bot.getProperty("adminID");

// 📢 Mandatory Channel Check on /start
if (user.telegramid != adm && !User.getProperty("channel_joined")) {
  var joinPrompt = "👋 *Welcome to @" + bot.name + "!* 🚀\n\n" +
    "⚠️ *Mandatory Step To Start:*\n" +
    "To use this bot and start earning UPI cash, you *MUST* join our official channel:\n" +
    "📢 https://t.me/BotsByAntares (`@BotsByAntares`)\n\n" +
    "_If you leave the channel in the future, bot access will be paused until you rejoin!_\n\n" +
    "👇 *Please join now and click Verify below:*";

  var joinKeyboard = [
    [{ text: "📢 Join @BotsByAntares", url: "https://t.me/BotsByAntares" }],
    [{ text: "✅ I Have Joined / Verify", callback_data: "/check_join" }]
  ];

  Bot.sendInlineKeyboard(joinKeyboard, joinPrompt);
  return;
}

// Silently verify channel for existing users
if (user.telegramid != adm) {
  var reqChans = Bot.getProperty("RequiredChannels", ["@BotsByAntares"]);
  var ch = (reqChans && reqChans.length > 0) ? reqChans[0] : "@BotsByAntares";
  Api.getChatMember({
    chat_id: ch,
    user_id: user.telegramid,
    on_result: "/on_check_join_silent"
  });
}

Bot.sendKeyboard(
  "💰 Balance,🏟 My Tasks\n👨‍💻 Tasks,⚙️ Settings,🤑 Withdraw\n🤝 Refer & Earn,➕ Deposit\n📞 Support,📝How To Use\n📋 Create Task",
  "*👋 Hey, Welcome To @" +
    bot.name +
    " Task Manager !*\n\n⛅️ _You Can Complete Here Task And Earn UPI CASH And Here You Can Create A Task And Promote Your Social Platforms._\n\n*🐼 You Can Earn A Lot Of Money From Here Just Complete The Task..*"
)

if (user.username != undefined) {
  var hh = "[@" + user.username + "]"
} else {
  var hh = ""
}
function touchingOwnLink() {
  Bot.sendMessage("*❌ Stop Clicking Your Own Link*")
}
function attractedByUser(refUser) {
  // Store referral relationship
  Bot.setProperty("UserReferrer_" + user.telegramid, refUser.telegramid, "string");
  User.setProperty("referrerId", refUser.telegramid, "string");

  // Add to referrer's detailed referrals list
  var refs = Bot.getProperty("UserReferrals_" + refUser.telegramid, []);
  if (!refs) { refs = []; }
  var nowTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  refs.unshift({
    id: user.telegramid,
    name: user.first_name,
    username: user.username || "",
    joined: nowTime,
    tasks_completed: 0,
    total_earned: 0
  });
  Bot.setProperty("UserReferrals_" + refUser.telegramid, refs, "json");

  // Increment total referrals counter
  var refCountRes = Libs.ResourcesLib.anotherUserRes("total_referrals", refUser.telegramid);
  refCountRes.add(1);

  var refComm = Bot.getProperty("ReferralTaskCommission", 0.5);

  Api.sendMessage({
    chat_id: refUser.telegramid,
    text:
      "🔋 *You Got a New Referral!* 🎉\n\n" +
      "👤 *Member:* [" + user.first_name + "](tg://user?id=" + user.telegramid + ")\n" +
      "🆔 *User ID:* `" + user.telegramid + "`\n" +
      "💎 *Reward Rate:* *₹" + refComm.toFixed(2) + "* for every task they complete (Lifetime)!\n\n" +
      "📈 _Keep sharing to earn more!_",
    parse_mode: "Markdown",
    disable_web_page_preview: true
  });
}
function alreadyStarted() {}

var tracks = {
  onTouchOwnLink: touchingOwnLink,
  onAtractedByUser: attractedByUser,
  onAlreadyAttracted: alreadyStarted
}

Libs.ReferralLib.track(tracks)
if (!User.getProperty("UserDone")) {
  User.setProperty("UserDone", true, "boolean")
  var stat = Libs.ResourcesLib.anotherChatRes("status", "global")
  stat.add(1)
  Api.sendMessage({
    chat_id: adm, //admin telegram id here
    text:
      "➕ <b>New User Notification</b> ➕\n\n👤<b>User:</b> <a href='tg://user?id=" +
      user.telegramid +
      "'>" +
      user.first_name +
      "</a> " +
      hh +
      "\n\n🆔<b> User ID :</b> <code>" +
      user.telegramid +
      "</code>\n\n🌝 <b>Total User's Count: " +
      stat.value() +
      "</b>",
    parse_mode: "html",
    disable_web_page_preview: true
  })
}

