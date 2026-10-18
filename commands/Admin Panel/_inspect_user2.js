/*CMD
  command: /inspect_user2
  help: 
  need_reply: true
  auto_retry_time: 
  folder: Admin Panel

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

Api.deleteMessage({ chat_id: chat.chatid, message_id: request.message_id });
var adm = Bot.getProperty("adminID");
if (user.telegramid != adm) {
  Bot.sendMessage("⛔️ Access Denied!");
  return;
}

var mm = User.getProperty("adminid");
var targetId = message.trim();

var targetChat = Bot.getProperty("Chat" + targetId);
if (!targetChat) {
  Api.editMessageText({
    message_id: mm,
    text: "❌ *User Not Found In Database!*\n\nPlease check the Telegram ID (`" + targetId + "`) and try again.",
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [[{ text: "◀ Back", callback_data: "/user_setting" }]]
    }
  });
  return;
}

var uName = targetChat.user && targetChat.user.first_name ? targetChat.user.first_name : "User";
var uUsername = targetChat.user && targetChat.user.username ? "@" + targetChat.user.username : "None";

var depBal = Libs.ResourcesLib.anotherUserRes("balance", targetId).value().toFixed(2);
var payBal = Libs.ResourcesLib.anotherUserRes("Available_For_Payout", targetId).value().toFixed(2);

var isBanned = Bot.getProperty("ban" + targetId) == "ban" ? "🚫 Banned" : "✅ Active / Normal";
var referrerId = Bot.getProperty("UserReferrer_" + targetId, "None (Direct)");
var myRefs = Bot.getProperty("UserReferrals_" + targetId, []);
var totalRefEarn = Libs.ResourcesLib.anotherUserRes("total_referral_earned", targetId).value().toFixed(2);

var dossier = "👤 *User Profile Dossier: " + uName + "*\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "🆔 *Telegram ID:* `" + targetId + "`\n" +
  "👤 *Username:* " + uUsername + "\n" +
  "🛡 *Account Status:* " + isBanned + "\n" +
  "🤝 *Referred By:* `" + referrerId + "`\n\n" +
  "💰 *Financial Holdings:*\n" +
  "📥 *Deposit Balance:* `₹" + depBal + "`\n" +
  "📤 *Available For Payout:* `₹" + payBal + "`\n\n" +
  "📊 *Referral Performance:*\n" +
  "👥 *Total Friends Referred:* `" + (myRefs ? myRefs.length : 0) + "`\n" +
  "💎 *Total Referral Commissions:* `₹" + totalRefEarn + "`\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •";

var inl = [
  [
    { text: "✉️ Send Private Message", callback_data: "/private_mass" },
    { text: "🗣 Add/Deduct Balance", callback_data: "/bc_balance" }
  ],
  [
    { text: "🚯 Ban / Unban User", callback_data: "/user_setting" }
  ],
  [
    { text: "◀ Back To User Settings", callback_data: "/user_setting" }
  ]
];

Api.editMessageText({
  message_id: mm,
  text: dossier,
  parse_mode: "Markdown",
  disable_web_page_preview: true,
  reply_markup: { inline_keyboard: inl }
});
