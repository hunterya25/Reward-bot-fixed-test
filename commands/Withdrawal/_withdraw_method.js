/*CMD
  command: /withdraw_method
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Withdrawal

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var selectedMethod = (params || "").trim().toLowerCase();
if (selectedMethod !== "usdt") {
  selectedMethod = "upi";
}

User.setProperty("current_with_method", selectedMethod, "string");

var balance = Libs.ResourcesLib.userRes("Available_For_Payout").value();
var withTaxPercent = parseFloat(Bot.getProperty("WithdrawTaxPercent", 0));
var taxText = withTaxPercent > 0 ? "\n▫️ *Withdrawal Fee / Tax:* " + withTaxPercent + "%" : "";

if (selectedMethod === "upi") {
  var upi = User.getProperty("upi_id");
  if (!upi) {
    Bot.sendMessage("🗂 *You Need To Setup Your UPI ID First!*\n\nGo to ⚙️ *Settings* ➔ *Wallet* to set your UPI address.");
    return;
  }

  var minWithdrawINR = parseFloat(Bot.getProperty("MinWithdrawAmount", 1));
  var maxWithdrawINR = parseFloat(Bot.getProperty("MaxWithdrawAmount", 1000));

  if (balance < minWithdrawINR) {
    Bot.sendMessage("⚠️ *Insufficient Balance For UPI Withdrawal!*\n\n💰 *Your Available Balance:* ₹" + balance.toFixed(2) + "\n▫️ *Minimum Withdrawal:* ₹" + minWithdrawINR);
    return;
  }

  var textUPI = "📤 *UPI Withdrawal Request*\n" +
    "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
    "💰 *Available For Payout:* ₹" + balance.toFixed(2) + "\n" +
    "🏦 *Registered UPI:* `" + upi + "`\n" +
    "▫️ *Min Withdrawal:* ₹" + minWithdrawINR + "\n" +
    "▫️ *Max Withdrawal:* ₹" + maxWithdrawINR + taxText + "\n" +
    "• ━━━━━━━━━━━━━━━━━━━━ •\n\n" +
    "👉 *Enter the amount you wish to withdraw in ₹:*";

  Bot.sendMessage(textUPI, { parse_mode: "Markdown" });
  Bot.runCommand("/withdraw_amount");
  return;
}

if (selectedMethod === "usdt") {
  var usdt = User.getProperty("usdt_bep20");
  if (!usdt) {
    Bot.sendMessage("💎 *You Need To Setup Your USDT (BEP20) Address First!*\n\nGo to ⚙️ *Settings* ➔ *Wallet* to set your BEP20 address.");
    return;
  }

  var usdtRate = parseFloat(Bot.getProperty("USDT_INR_Rate", 90));
  var minUSDT = parseFloat(Bot.getProperty("MinWithdrawUSDT", 1));
  var maxUSDT = parseFloat(Bot.getProperty("MaxWithdrawUSDT", 100));

  var minUSDTinINR = minUSDT * usdtRate;
  var maxUSDTinINR = maxUSDT * usdtRate;

  if (balance < minUSDTinINR) {
    Bot.sendMessage(
      "⚠️ *Insufficient Balance For USDT Withdrawal!*\n\n" +
      "💰 *Your Available Balance:* ₹" + balance.toFixed(2) + " (~" + (balance / usdtRate).toFixed(2) + " USDT)\n" +
      "▫️ *Minimum Withdrawal:* " + minUSDT + " USDT (~₹" + minUSDTinINR.toFixed(2) + ")",
      { parse_mode: "Markdown" }
    );
    return;
  }

  var approxUSDT = (balance / usdtRate).toFixed(2);

  var textUSDT = "💎 *USDT (BEP20 / BSC) Withdrawal Request*\n" +
    "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
    "💰 *Available For Payout:* ₹" + balance.toFixed(2) + " _(~" + approxUSDT + " USDT)_\n" +
    "📊 *Exchange Rate:* `1 USDT = ₹" + usdtRate.toFixed(2) + "`\n" +
    "📁 *Registered BEP20 Address:*\n`" + usdt + "`\n" +
    "🌐 *Network:* Binance Smart Chain (BEP20)\n\n" +
    "▫️ *Min Withdrawal:* `" + minUSDT + " USDT` (~₹" + minUSDTinINR.toFixed(2) + ")\n" +
    "▫️ *Max Withdrawal:* `" + maxUSDT + " USDT` (~₹" + maxUSDTinINR.toFixed(2) + ")" + taxText + "\n" +
    "• ━━━━━━━━━━━━━━━━━━━━ •\n\n" +
    "⚠️ *STRICT WARNING:*\n" +
    "• Payment will be sent via **Binance Smart Chain (BEP20)** only!\n" +
    "• If your wallet does not support BEP20 USDT, funds will be permanently lost and we are NOT responsible!\n" +
    "• ━━━━━━━━━━━━━━━━━━━━ •\n\n" +
    "👉 *Enter the amount in ₹ to withdraw as USDT:*\n" +
    "_(Example: enter " + minUSDTinINR.toFixed(0) + " for " + minUSDT + " USDT, or " + (minUSDTinINR * 2).toFixed(0) + " for " + (minUSDT * 2) + " USDT)_";

  Bot.sendMessage(textUSDT, { parse_mode: "Markdown" });
  Bot.runCommand("/withdraw_amount");
  return;
}
