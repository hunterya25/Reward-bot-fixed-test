/*CMD
  command: /refer
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Referral

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 🤝 refer & earn, 🤝 Refer & Earn
  group: 
CMD*/

var refGate = Bot.getProperty("Referral_status", "✅");
var adm = Bot.getProperty("adminID");

if (refGate == "❌" && user.telegramid != adm) {
  var offMsg = "⛔️ *Referral Program is temporarily paused by Administration.*\n\nPlease check back later or contact Support.";
  if (request.message && request.message.message_id) {
    Api.editMessageText({
      message_id: request.message.message_id,
      text: offMsg,
      parse_mode: "Markdown"
    });
  } else {
    Bot.sendMessage(offMsg, { parse_mode: "Markdown" });
  }
  return;
}

var refComm = Bot.getProperty("ReferralTaskCommission", 0.5);
var myRefs = Bot.getProperty("UserReferrals_" + user.telegramid, []);
if (!myRefs) { myRefs = []; }

var totalEarnedRes = Libs.ResourcesLib.anotherUserRes("total_referral_earned", user.telegramid);
var totalEarned = totalEarnedRes ? totalEarnedRes.value() : 0;

var totalTasksDone = 0;
for (var i = 0; i < myRefs.length; i++) {
  if (myRefs[i].tasks_completed) {
    totalTasksDone += parseInt(myRefs[i].tasks_completed);
  }
}

var botUser = Bot.getProperty("bot_username");
if (!botUser) {
  botUser = (bot && bot.name && !bot.name.includes(" ")) ? bot.name : "backuppro123bot";
}
botUser = botUser.replace("@", "").trim();

var refLink = "https://t.me/" + botUser + "?start=" + user.telegramid;
var shareText = encodeURIComponent("🚀 Complete easy tasks and earn real UPI cash!");
var shareUrl = "https://t.me/share/url?url=" + encodeURIComponent(refLink) + "&text=" + shareText;

var text = "🤝 *Refer & Earn Lifetime Program!* 💰\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "Invite your friends and earn money *every single time* they complete a task!\n\n" +
  "💎 *Reward Rate:* *₹" + refComm.toFixed(2) + " per task* completed by your friend\n" +
  "♾ *Validity:* *Lifetime Earnings!* (No limits!)\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n\n" +
  "📊 *Your Referral Performance:*\n" +
  "👥 *Total Friends Referred:* `" + myRefs.length + "` friends\n" +
  "📋 *Tasks Completed by Friends:* `" + totalTasksDone + "` tasks\n" +
  "💰 *Total Commission Earned:* `₹" + totalEarned.toFixed(2) + "`\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n\n" +
  "🔗 *Your Exclusive Referral Link:*\n" +
  "`" + refLink + "`\n\n" +
  "💡 _Share this link with your friends to start earning passive income!_";

var inl = [
  [
    { text: "👥 My Referrals (" + myRefs.length + ")", callback_data: "/my_referrals 1" },
    { text: "📜 Earnings History", callback_data: "/ref_history 1" }
  ],
  [
    { text: "📤 Share Referral Link", url: shareUrl }
  ],
  [
    { text: "🔄 Refresh", callback_data: "/refer" }
  ]
];

if (request.message && request.message.message_id) {
  Api.editMessageText({
    message_id: request.message.message_id,
    text: text,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
} else {
  Api.sendMessage({
    text: text,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
}
