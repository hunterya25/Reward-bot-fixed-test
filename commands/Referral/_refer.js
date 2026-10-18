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

var refLink = "https://t.me/" + bot.name + "?start=" + user.telegramid;
var shareText = encodeURIComponent("🚀 Join @" + bot.name + " and earn real UPI cash by completing easy tasks!\nJoin now: " + refLink);

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
  "💡 _Share this link with your friends or in Telegram groups to maximize your passive earnings!_";

var inl = [
  [
    { text: "👥 My Referrals (" + myRefs.length + ")", callback_data: "/my_referrals 1" },
    { text: "📜 Earnings History", callback_data: "/ref_history 1" }
  ],
  [
    { text: "📤 Share Referral Link", url: "https://t.me/share/url?url=" + encodeURIComponent(refLink) + "&text=" + shareText }
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
