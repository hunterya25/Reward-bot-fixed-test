/*CMD
  command: /bot_analytics
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Admin Panel

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var adm = Bot.getProperty("adminID");
if (user.telegramid != adm) {
  Bot.sendMessage("⛔️ Access Denied!");
  return;
}

var mm = User.getProperty("adminid");

// Metrics
var totalUsers = Libs.ResourcesLib.anotherChatRes("status", "global").value();
var totalTasks = Libs.ResourcesLib.anotherChatRes("total_task", "global").value();
var totalWithdraw = Libs.ResourcesLib.anotherChatRes("totalwithdraw", "global").value();
var totalDeposit = Libs.ResourcesLib.anotherChatRes("totaldeposit", "global").value();

var pendingW = Bot.getProperty("PendingWithdrawals", []);
var pendingD = Bot.getProperty("PendingDeposits", []);
var bannedUsers = Bot.getProperty("Banned_Users", []);

var mMode = Bot.getProperty("maintenance", "❌");
var depMode = Bot.getProperty("Deposit_status", "✅");
var withMode = Bot.getProperty("Withdraw_status", "✅");

var statsText = "📊 *Comprehensive Bot Analytics & Statistics*\n\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "👥 *Total Registered Users:* `" + totalUsers + "`\n" +
  "📋 *Total Tasks Published:* `" + totalTasks + "`\n\n" +
  "💰 *Financial Ledger:*\n" +
  "📥 *Total Deposits:* `₹" + totalDeposit.toFixed(2) + "`\n" +
  "📤 *Total Withdrawals Paid:* `₹" + totalWithdraw.toFixed(2) + "`\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n\n" +
  "⏳ *Pending Review Queue:*\n" +
  "💸 *Pending Withdrawals:* `" + pendingW.length + "` requests\n" +
  "📥 *Pending Deposits:* `" + pendingD.length + "` requests\n" +
  "🚫 *Banned Users:* `" + bannedUsers.length + "` users\n\n" +
  "⚙️ *System Health & Switches:*\n" +
  "🛠 *Maintenance Mode:* " + mMode + "\n" +
  "📥 *Deposit Gate:* " + depMode + "\n" +
  "📤 *Withdrawal Gate:* " + withMode + "\n" +
  "👑 *Active Admin ID:* `" + adm + "`\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •";

var inl = [
  [
    { text: "💸 View Withdrawals (" + pendingW.length + ")", callback_data: "/with_requests" },
    { text: "📥 View Deposits (" + pendingD.length + ")", callback_data: "/dep_requests" }
  ],
  [
    { text: "🔄 Refresh Stats", callback_data: "/bot_analytics" },
    { text: "◀ Back To Panel", callback_data: "/admin" }
  ]
];

if (mm) {
  Api.editMessageText({
    message_id: mm,
    text: statsText,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
} else {
  Api.sendMessage({
    text: statsText,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
}
