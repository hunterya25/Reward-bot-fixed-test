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

if (request && request.id) {
  Api.answerCallbackQuery({ callback_query_id: request.id });
}

var selectedMethod = (params || "").trim().toLowerCase();
if (selectedMethod !== "usdt") {
  selectedMethod = "upi";
}

User.setProperty("current_with_method", selectedMethod, "string");

var balance = Libs.ResourcesLib.userRes("Available_For_Payout").value();
var withTaxPercent = parseFloat(Bot.getProperty("WithdrawTaxPercent", 0));
var taxText = withTaxPercent > 0 ? "\n▫️ *Withdrawal Fee / Tax:* `" + withTaxPercent + "%`" : "";

if (selectedMethod === "upi") {
  var upi = User.getProperty("upi_id");
  if (!upi) {
    var noUpiInl = [
      [{ text: "🇮🇳 Set UPI ID Now", callback_data: "/s_wall" }],
      [{ text: "🔙 Back to Methods", callback_data: "/withdraw" }]
    ];
    Api.sendMessage({
      text: "🗂 *You Need To Setup Your UPI ID First!*\n\nPlease configure your UPI address to proceed with withdrawal.",
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: noUpiInl }
    });
    return;
  }

  var minWithdrawINR = parseFloat(Bot.getProperty("MinWithdrawAmount", 1));
  var maxWithdrawINR = parseFloat(Bot.getProperty("MaxWithdrawAmount", 1000));

  if (balance < minWithdrawINR) {
    var lowBalInl = [
      [{ text: "🔙 Back to Methods", callback_data: "/withdraw" }]
    ];
    Api.sendMessage({
      text: "⚠️ *Insufficient Balance For UPI Withdrawal!*\n\n💰 *Your Available Balance:* ₹" + balance.toFixed(2) + "\n▫️ *Minimum Withdrawal:* ₹" + minWithdrawINR,
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: lowBalInl }
    });
    return;
  }

  var textUPI = "📤 *UPI Withdrawal Request*\n" +
    "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
    "💰 *Available For Payout:* `₹" + balance.toFixed(2) + "`\n" +
    "🏦 *Registered UPI:* `" + upi + "`\n" +
    "▫️ *Min Withdrawal:* `₹" + minWithdrawINR + "`\n" +
    "▫️ *Max Withdrawal:* `₹" + maxWithdrawINR + "`" + taxText + "\n" +
    "• ━━━━━━━━━━━━━━━━━━━━ •\n\n" +
    "👉 *Enter the amount you wish to withdraw in ₹:*\n" +
    "_(Example: 50 or 100)_";

  var cancelInl = [
    [{ text: "❌ Cancel Withdrawal", callback_data: "/cancel_with" }]
  ];

  Api.sendMessage({
    text: textUPI,
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: cancelInl }
  });
  Bot.runCommand("/withdraw_amount");
  return;
}

if (selectedMethod === "usdt") {
  var usdt = User.getProperty("usdt_bep20");
  if (!usdt) {
    var noUsdtInl = [
      [{ text: "💎 Set USDT (BEP20) Address", callback_data: "/s_usdt" }],
      [{ text: "🔙 Back to Methods", callback_data: "/withdraw" }]
    ];
    Api.sendMessage({
      text: "💎 *You Need To Setup Your USDT (BEP20) Address First!*\n\nPlease configure your BEP20 address in Settings to proceed.",
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: noUsdtInl }
    });
    return;
  }

  var usdtRate = parseFloat(Bot.getProperty("USDT_INR_Rate", 90));
  var minUSDT = parseFloat(Bot.getProperty("MinWithdrawUSDT", 1));
  var maxUSDT = parseFloat(Bot.getProperty("MaxWithdrawUSDT", 100));

  var minUSDTinINR = minUSDT * usdtRate;
  var maxUSDTinINR = maxUSDT * usdtRate;

  if (balance < minUSDTinINR) {
    var lowUsdtInl = [
      [{ text: "🔙 Back to Methods", callback_data: "/withdraw" }]
    ];
    Api.sendMessage({
      text: "⚠️ *Insufficient Balance For USDT Withdrawal!*\n\n" +
        "💰 *Your Available Balance:* ₹" + balance.toFixed(2) + " (~" + (balance / usdtRate).toFixed(2) + " USDT)\n" +
        "▫️ *Minimum Withdrawal:* `" + minUSDT + " USDT` (~₹" + minUSDTinINR.toFixed(2) + ")",
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: lowUsdtInl }
    });
    return;
  }

  var approxUSDT = (balance / usdtRate).toFixed(2);

  var textUSDT = "💎 *USDT (BEP20 / BSC) Withdrawal Request*\n" +
    "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
    "💰 *Available For Payout:* `₹" + balance.toFixed(2) + "` _(~" + approxUSDT + " USDT)_\n" +
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

  var cancelInl = [
    [{ text: "❌ Cancel Withdrawal", callback_data: "/cancel_with" }]
  ];

  Api.sendMessage({
    text: textUSDT,
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: cancelInl }
  });
  Bot.runCommand("/withdraw_amount");
  return;
}
