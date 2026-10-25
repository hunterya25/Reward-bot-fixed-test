/*CMD
  command: /withdraw
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Withdrawal

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 🤑 withdraw, 🤑 Withdraw
  group: 
CMD*/

if (request && request.id) {
  Api.answerCallbackQuery({ callback_query_id: request.id });
}

var wit = Bot.getProperty("Withdraw_status", "✅");
var adm = Bot.getProperty("adminID");

if (wit == "❌" && user.telegramid != adm) {
  Bot.sendMessage("⛔️ *Withdrawals are temporarily disabled by Administration.*\n\nPlease check back later or contact Support.");
  return;
}

var upi = User.getProperty("upi_id");
var usdt = User.getProperty("usdt_bep20");
var balance = Libs.ResourcesLib.userRes("Available_For_Payout").value();
var usdtRate = parseFloat(Bot.getProperty("USDT_INR_Rate", 90));
var approxUSDT = (balance / usdtRate).toFixed(2);

var minWithdrawINR = parseFloat(Bot.getProperty("MinWithdrawAmount", 1));
var maxWithdrawINR = parseFloat(Bot.getProperty("MaxWithdrawAmount", 1000));
var minUSDT = parseFloat(Bot.getProperty("MinWithdrawUSDT", 1));
var maxUSDT = parseFloat(Bot.getProperty("MaxWithdrawUSDT", 100));

// If neither UPI nor USDT is configured
if (!upi && !usdt) {
  var noWalletText = "🗂 *You Need To Setup A Payout Method First!*\n\n" +
    "You have not configured any payment address yet. Please add your payout method:\n" +
    "• 🇮🇳 *UPI ID* (for instant bank/Paytm payout)\n" +
    "• 💎 *USDT (BEP20)* (for direct crypto payout)\n\n" +
    "👉 Tap a button below to configure your payout account:";

  var noWalletInl = [
    [{ text: "🇮🇳 Set UPI ID", callback_data: "/s_wall" }],
    [{ text: "💎 Set USDT (BEP20)", callback_data: "/s_usdt" }],
    [{ text: "⚙️ Wallet Settings", callback_data: "/wallet" }]
  ];

  if (request && request.message && request.message.message_id) {
    Api.editMessageText({
      message_id: request.message.message_id,
      text: noWalletText,
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: noWalletInl }
    });
  } else {
    Api.sendMessage({
      text: noWalletText,
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: noWalletInl }
    });
  }
  return;
}

var upiDisplay = upi ? "`" + upi + "`" : "❌ _Not Configured_";
var usdtDisplay = usdt
  ? "`" + usdt.substring(0, 8) + "..." + usdt.substring(usdt.length - 6) + "`"
  : "❌ _Not Configured_";

var methodText = "📤 *Select Your Withdrawal Method*\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "💰 *Available For Payout:* ₹" + balance.toFixed(2) + " _(~" + approxUSDT + " USDT)_\n\n" +
  "💳 *Your Registered Accounts:*\n" +
  "1️⃣ 🇮🇳 *UPI:* " + upiDisplay + "\n" +
  "2️⃣ 💎 *USDT (BEP20):* " + usdtDisplay + "\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "👉 *Choose how you want to receive your earnings:*";

var methodInl = [];

if (upi) {
  methodInl.push([
    { text: "🇮🇳 Withdraw to UPI (Min ₹" + minWithdrawINR + ")", callback_data: "/withdraw_method upi" }
  ]);
} else {
  methodInl.push([
    { text: "🇮🇳 Setup UPI ID", callback_data: "/s_wall" }
  ]);
}

if (usdt) {
  methodInl.push([
    { text: "💎 Withdraw to USDT BEP20 (Min " + minUSDT + " USDT)", callback_data: "/withdraw_method usdt" }
  ]);
} else {
  methodInl.push([
    { text: "💎 Setup USDT (BEP20) Address", callback_data: "/s_usdt" }
  ]);
}

methodInl.push([
  { text: "⚙️ Payout Settings", callback_data: "/wallet" }
]);

if (request && request.message && request.message.message_id) {
  Api.editMessageText({
    message_id: request.message.message_id,
    text: methodText,
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: methodInl }
  });
} else {
  Api.sendMessage({
    text: methodText,
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: methodInl }
  });
}
