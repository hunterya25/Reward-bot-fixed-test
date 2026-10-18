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
  aliases: 🤑 withdraw
  group: 
CMD*/

var wit = Bot.getProperty("Withdraw_status", "✅");
var adm = Bot.getProperty("adminID");

if (wit == "❌" && user.telegramid != adm) {
  Bot.sendMessage("⛔️ *Withdrawals are temporarily disabled by Administration.*\n\nPlease check back later or contact Support.");
  return;
}

var upi = User.getProperty("upi_id");
if (!upi) {
  Bot.sendMessage("🗂 *You Need To Setup Your UPI ID First!*\n\nGo to ⚙️ *Settings* ➔ *Wallet* to set your UPI address.");
  return;
}

var minWithdrawINR = parseFloat(Bot.getProperty("MinWithdrawAmount", 1));
var maxWithdrawINR = parseFloat(Bot.getProperty("MaxWithdrawAmount", 1000));
var withTaxPercent = parseFloat(Bot.getProperty("WithdrawTaxPercent", 0));
var balance = Libs.ResourcesLib.userRes("Available_For_Payout").value();

if (balance < minWithdrawINR) {
  Bot.sendMessage("⚠️ *Insufficient Balance For Withdrawal!*\n\n💰 *Your Available Balance:* ₹" + balance.toFixed(2) + "\n▫️ *Minimum Withdrawal:* ₹" + minWithdrawINR);
  return;
}

var taxText = withTaxPercent > 0 ? "\n▫️ *Fee / Tax:* " + withTaxPercent + "%" : "";

Bot.sendMessage(
  "📤 *Withdrawal Request*\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "💰 *Available For Payout:* ₹" + balance.toFixed(2) + "\n" +
  "🏦 *Registered UPI:* `" + upi + "`\n" +
  "▫️ *Min Withdrawal:* ₹" + minWithdrawINR + "\n" +
  "▫️ *Max Withdrawal:* ₹" + maxWithdrawINR + taxText + "\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n\n" +
  "👉 *Enter the amount you wish to withdraw in ₹:*"
);

Bot.runCommand("/withdraw_amount");
