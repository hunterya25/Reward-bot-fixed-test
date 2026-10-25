/*CMD
  command: /withdraw_amount
  help: 
  need_reply: true
  auto_retry_time: 
  folder: Withdrawal

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var wit = Bot.getProperty("Withdraw_status", "✅");
var adm = Bot.getProperty("adminID");

if (wit == "❌" && user.telegramid != adm) {
  Bot.sendMessage("⛔️ *Withdrawals are temporarily disabled by Administration.* Please check back later.");
  return;
}

var inputMsg = (message || "").trim();

if (inputMsg.toLowerCase() === "/cancel" || inputMsg.toLowerCase() === "cancel") {
  User.deleteProperty("temp_withdraw_data");
  User.deleteProperty("current_with_method");
  Bot.sendMessage("❌ *Withdrawal request cancelled.*");
  return;
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

if (!isNumeric(inputMsg)) {
  var retryInl = [
    [{ text: "❌ Cancel Withdrawal", callback_data: "/cancel_with" }]
  ];
  Api.sendMessage({
    text: "❌ *Invalid amount! Please enter a valid numeric value* (e.g. 50 or 100):\n\n_(Or tap Cancel below)_",
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: retryInl }
  });
  Bot.runCommand("/withdraw_amount");
  return;
}

var reqAmount = parseFloat(inputMsg);
var method = User.getProperty("current_with_method", "upi");
var balance = Libs.ResourcesLib.userRes("Available_For_Payout");
var withTaxPercent = parseFloat(Bot.getProperty("WithdrawTaxPercent", 0));

var upi = User.getProperty("upi_id");
var usdt = User.getProperty("usdt_bep20");
var usdtRate = parseFloat(Bot.getProperty("USDT_INR_Rate", 90));

var minLimitINR = 0;
var maxLimitINR = 0;
var payoutDestination = "";
var isCrypto = (method === "usdt");

if (isCrypto) {
  if (!usdt) {
    Bot.sendMessage("💎 *You Need To Setup Your USDT (BEP20) Address First!*\n\nGo to ⚙️ *Settings* ➔ *Wallet* to set your BEP20 address.");
    return;
  }
  var minUSDT = parseFloat(Bot.getProperty("MinWithdrawUSDT", 1));
  var maxUSDT = parseFloat(Bot.getProperty("MaxWithdrawUSDT", 100));
  minLimitINR = minUSDT * usdtRate;
  maxLimitINR = maxUSDT * usdtRate;
  payoutDestination = usdt;
} else {
  if (!upi) {
    Bot.sendMessage("🗂 *You Need To Setup Your UPI ID First!*\n\nGo to ⚙️ *Settings* ➔ *Wallet* to set your UPI address.");
    return;
  }
  minLimitINR = parseFloat(Bot.getProperty("MinWithdrawAmount", 1));
  maxLimitINR = parseFloat(Bot.getProperty("MaxWithdrawAmount", 1000));
  payoutDestination = upi;
}

if (reqAmount < minLimitINR) {
  var minLimitDesc = isCrypto
    ? parseFloat(Bot.getProperty("MinWithdrawUSDT", 1)) + " USDT (~₹" + minLimitINR.toFixed(2) + ")"
    : "₹" + minLimitINR;

  var errInlMin = [
    [{ text: "🔄 Enter Different Amount", callback_data: "/withdraw_method " + method }],
    [{ text: "❌ Cancel Withdrawal", callback_data: "/cancel_with" }]
  ];

  Api.sendMessage({
    text: "⚠️ *Amount is below minimum limit!*\n\n" +
      "▫️ *Minimum Withdrawal:* `" + minLimitDesc + "`\n" +
      "💰 *Your Available Balance:* `₹" + balance.value().toFixed(2) + "`\n\n" +
      "👉 *Please enter a valid amount:*",
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: errInlMin }
  });
  Bot.runCommand("/withdraw_amount");
  return;
}

if (reqAmount > maxLimitINR) {
  var maxLimitDesc = isCrypto
    ? parseFloat(Bot.getProperty("MaxWithdrawUSDT", 100)) + " USDT (~₹" + maxLimitINR.toFixed(2) + ")"
    : "₹" + maxLimitINR;

  var errInlMax = [
    [{ text: "🔄 Enter Different Amount", callback_data: "/withdraw_method " + method }],
    [{ text: "❌ Cancel Withdrawal", callback_data: "/cancel_with" }]
  ];

  Api.sendMessage({
    text: "⚠️ *Amount exceeds maximum limit!*\n\n" +
      "▫️ *Maximum Withdrawal:* `" + maxLimitDesc + "`\n" +
      "💰 *Your Available Balance:* `₹" + balance.value().toFixed(2) + "`\n\n" +
      "👉 *Please enter a smaller amount:*",
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: errInlMax }
  });
  Bot.runCommand("/withdraw_amount");
  return;
}

if (balance.value() < reqAmount) {
  var lowBalInl = [
    [{ text: "🔄 Enter Different Amount", callback_data: "/withdraw_method " + method }],
    [{ text: "❌ Cancel Withdrawal", callback_data: "/cancel_with" }]
  ];

  Api.sendMessage({
    text: "⚠️ *Insufficient Available Balance!*\n\n" +
      "▫️ *Requested:* `₹" + reqAmount.toFixed(2) + "`\n" +
      "💰 *Available for Payout:* `₹" + balance.value().toFixed(2) + "`\n\n" +
      "👉 *Please enter an amount within your balance:*",
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: lowBalInl }
  });
  Bot.runCommand("/withdraw_amount");
  return;
}

// Calculate Platform Fee / Tax
var taxAmt = 0;
if (withTaxPercent > 0) {
  taxAmt = (reqAmount * withTaxPercent) / 100;
}
var netPayoutINR = reqAmount - taxAmt;
var netUSDT = isCrypto ? (netPayoutINR / usdtRate).toFixed(4) : null;

// Save temporary unconfirmed withdrawal draft (DO NOT deduct balance yet!)
var tempWithData = {
  method: isCrypto ? "USDT" : "UPI",
  amount: reqAmount,
  tax: taxAmt,
  tax_percent: withTaxPercent,
  net_amount: netPayoutINR,
  usdt_rate: isCrypto ? usdtRate : null,
  usdt_amount: netUSDT,
  crypto_address: isCrypto ? usdt : null,
  network: isCrypto ? "Binance Smart Chain (BEP20)" : null,
  upi: isCrypto ? null : upi,
  destination: payoutDestination,
  created_at: Date.now()
};

User.setProperty("temp_withdraw_data", tempWithData, "json");

var confirmInl = [
  [
    { text: "✅ Confirm & Submit", callback_data: "/confirm_with" },
    { text: "❌ Cancel", callback_data: "/cancel_with" }
  ]
];

if (isCrypto) {
  var taxNoticeCrypto = withTaxPercent > 0 ? "▫️ *Platform Fee / Tax (" + withTaxPercent + "%):* `-₹" + taxAmt.toFixed(2) + "`\n" : "";

  var verifyTextUSDT = "📋 *Crypto Withdrawal Verification & Confirmation*\n" +
    "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
    "🔍 *Please review your USDT payout details carefully:*\n\n" +
    "💎 *Payment Method:* USDT (BEP20 / BSC)\n" +
    "📁 *Receiving BEP20 Address:*\n`" + usdt + "`\n" +
    "🌐 *Network:* Binance Smart Chain (BEP20)\n" +
    "💰 *Amount in INR:* `₹" + reqAmount.toFixed(2) + "`\n" +
    "📊 *Exchange Rate:* `1 USDT = ₹" + usdtRate.toFixed(2) + "`\n" +
    taxNoticeCrypto +
    "💎 *Final Net USDT to Receive:* *" + netUSDT + " USDT*\n" +
    "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
    "⚠️ *STRICT WARNING:*\n" +
    "• Payment will be sent via **Binance Smart Chain (BEP20)** only!\n" +
    "• Do NOT use addresses from TRC20, ERC20, Polygon, or other incompatible networks.\n" +
    "• If you provide an incorrect or non-BEP20 address, *funds will be permanently lost and we are NOT responsible!*\n" +
    "• ━━━━━━━━━━━━━━━━━━━━ •\n\n" +
    "👉 *Tap 'Confirm & Submit' to proceed, or 'Cancel' to abort:*";

  Api.sendMessage({
    text: verifyTextUSDT,
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: confirmInl }
  });
} else {
  var taxNoticeUPI = withTaxPercent > 0 ? "▫️ *Platform Fee / Tax (" + withTaxPercent + "%):* `-₹" + taxAmt.toFixed(2) + "`\n" : "";

  var verifyTextUPI = "📋 *Withdrawal Verification & Confirmation*\n" +
    "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
    "🔍 *Please review your UPI payout details carefully:*\n\n" +
    "💳 *Payment Method:* 🇮🇳 UPI Transfer\n" +
    "🏦 *Receiving UPI ID:* `" + upi + "`\n" +
    "💰 *Withdrawal Amount:* `₹" + reqAmount.toFixed(2) + "`\n" +
    taxNoticeUPI +
    "💵 *Final Net Payout:* *₹" + netPayoutINR.toFixed(2) + "*\n" +
    "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
    "⚠️ *Attention:*\n" +
    "• Please verify your UPI ID is active and correctly spelled.\n" +
    "• Payments sent to incorrect UPI IDs cannot be reversed or refunded!\n" +
    "• ━━━━━━━━━━━━━━━━━━━━ •\n\n" +
    "👉 *Tap 'Confirm & Submit' to proceed, or 'Cancel' to abort:*";

  Api.sendMessage({
    text: verifyTextUPI,
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: confirmInl }
  });
}
