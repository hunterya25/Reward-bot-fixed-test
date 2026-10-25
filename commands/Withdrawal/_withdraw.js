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

var wit = Bot.getProperty("Withdraw_status", "✅");
var adm = Bot.getProperty("adminID");

if (wit == "❌" && user.telegramid != adm) {
  Bot.sendMessage("⛔️ *Withdrawals are temporarily disabled by Administration.*\n\nPlease check back later or contact Support.");
  return;
}

var upi = User.getProperty("upi_id");
var usdt = User.getProperty("usdt_bep20");

if (!upi && !usdt) {
  var noWalletText = "🗂 *You Need To Setup A Payout Method First!*\n\n" +
    "You have not configured any payment address yet. Please add your payout method:\n" +
    "• 🇮🇳 **UPI ID** (for instant bank/Paytm payout)\n" +
    "• 💎 **USDT (BEP20)** (for direct crypto payout)\n\n" +
    "👉 Tap the button below to configure your wallet in Settings:";

  var noWalletInl = [
    [{ text: "💼 Configure Wallet in Settings", callback_data: "/wallet" }]
  ];

  Bot.sendMessage(noWalletText, { parse_mode: "Markdown", reply_markup: { inline_keyboard: noWalletInl } });
  return;
}

var balance = Libs.ResourcesLib.userRes("Available_For_Payout").value();
var usdtRate = parseFloat(Bot.getProperty("USDT_INR_Rate", 90));
var approxUSDT = (balance / usdtRate).toFixed(2);

var minWithdrawINR = parseFloat(Bot.getProperty("MinWithdrawAmount", 1));
var minUSDT = parseFloat(Bot.getProperty("MinWithdrawUSDT", 1));
var minUSDTinINR = minUSDT * usdtRate;

// If both UPI and USDT are available, let the user choose
if (upi && usdt) {
  var methodText = "📤 *Select Your Withdrawal Method*\n" +
    "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
    "💰 *Available For Payout:* ₹" + balance.toFixed(2) + " _(~" + approxUSDT + " USDT)_\n\n" +
    "Choose how you want to receive your earnings:\n" +
    "1️⃣ 🇮🇳 *UPI* ➔ `" + upi + "`\n" +
    "2️⃣ 💎 *USDT (BEP20)* ➔ `" + usdt.substring(0, 8) + "..." + usdt.substring(usdt.length - 6) + "`\n" +
    "• ━━━━━━━━━━━━━━━━━━━━ •";

  var methodInl = [
    [{ text: "🇮🇳 Withdraw to UPI (Min ₹" + minWithdrawINR + ")", callback_data: "/withdraw_method upi" }],
    [{ text: "💎 Withdraw to USDT BEP20 (Min " + minUSDT + " USDT)", callback_data: "/withdraw_method usdt" }]
  ];

  Bot.sendMessage(methodText, { parse_mode: "Markdown", reply_markup: { inline_keyboard: methodInl } });
  return;
}

// If only UPI is available
if (upi && !usdt) {
  Bot.runCommand("/withdraw_method upi");
  return;
}

// If only USDT is available
if (!upi && usdt) {
  Bot.runCommand("/withdraw_method usdt");
  return;
}
