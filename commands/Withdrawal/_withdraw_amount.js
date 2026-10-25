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

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

if (!isNumeric(message)) {
  Bot.sendMessage("❌ *Invalid input! Please send a valid numeric amount.*");
  Bot.runCommand("/withdraw");
  return;
}

var reqAmount = parseFloat(message);
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
  if (isCrypto) {
    var minU = parseFloat(Bot.getProperty("MinWithdrawUSDT", 1));
    Bot.sendMessage("⚠️ *Minimum Withdrawal is " + minU + " USDT (~₹" + minLimitINR.toFixed(2) + ").*\n\n💰 *Your Available Balance:* ₹" + balance.value().toFixed(2));
  } else {
    Bot.sendMessage("⚠️ *Minimum Withdrawal is ₹" + minLimitINR + ".*\n\n💰 *Your Available Balance:* ₹" + balance.value().toFixed(2));
  }
  return;
}

if (reqAmount > maxLimitINR) {
  if (isCrypto) {
    var maxU = parseFloat(Bot.getProperty("MaxWithdrawUSDT", 100));
    Bot.sendMessage("⚠️ *Maximum Withdrawal limit is " + maxU + " USDT (~₹" + maxLimitINR.toFixed(2) + ").*");
  } else {
    Bot.sendMessage("⚠️ *Maximum Withdrawal limit is ₹" + maxLimitINR + ".*");
  }
  return;
}

if (balance.value() < reqAmount) {
  Bot.sendMessage(
    "⚠️ *Insufficient Available Balance!*\n\n" +
    "Requested: ₹" + reqAmount.toFixed(2) + "\n" +
    "💰 *Available for Payout:* ₹" + balance.value().toFixed(2)
  );
  return;
}

// Calculate Tax / Fee
var taxAmt = 0;
if (withTaxPercent > 0) {
  taxAmt = (reqAmount * withTaxPercent) / 100;
}
var netPayoutINR = reqAmount - taxAmt;
var netUSDT = isCrypto ? (netPayoutINR / usdtRate).toFixed(4) : null;

// Deduct Balance from Available_For_Payout
balance.remove(reqAmount);

var wid = Libs.Random.randomInt(100000, 999999).toString();
var nowTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

var withRecord = {
  id: wid,
  user_id: user.telegramid,
  first_name: user.first_name,
  username: user.username || "",
  method: isCrypto ? "USDT" : "UPI",
  amount: reqAmount,
  tax: taxAmt,
  tax_percent: withTaxPercent,
  net_amount: netPayoutINR,
  usdt_rate: isCrypto ? usdtRate : null,
  usdt_amount: netUSDT,
  crypto_address: isCrypto ? usdt : null,
  network: isCrypto ? "Binance Smart Chain (BEP20)" : null,
  upi: payoutDestination,
  status: "Pending",
  created_at: nowTime
};

Bot.setProperty("With_" + wid, withRecord, "json");

// Add to Global Pending Withdrawals List
var pendingW = Bot.getProperty("PendingWithdrawals", []);
if (!pendingW) { pendingW = []; }
pendingW.push(wid);
Bot.setProperty("PendingWithdrawals", pendingW, "json");

// Add to User's Personal Withdrawals List
var userWithList = User.getProperty("UserWithdrawals", []);
if (!userWithList) { userWithList = []; }
userWithList.unshift(wid);
User.setProperty("UserWithdrawals", userWithList, "json");

// Log into user history
var his = Bot.getProperty("history" + user.telegramid) || "";
var historyDetails = isCrypto
  ? (netUSDT + " USDT (₹" + reqAmount.toFixed(2) + ") to `" + usdt + "`")
  : ("₹" + reqAmount.toFixed(2) + " to `" + upi + "`");

var newHis = "⏳ *Withdrawal Requested:*\n📅 Time: " + nowTime + "\n💰 " + historyDetails + "\n🆔 Status: Pending Review (#" + wid + ")\n\n" + his;
Bot.setProperty("history" + user.telegramid, newHis);

// Interactive Buttons for Admin
var adminButtons = [
  [
    { text: "✅ Approve Payout", callback_data: "/app_with " + wid },
    { text: "❌ Reject & Refund", callback_data: "/rej_with " + wid }
  ]
];

var taxAdminText = withTaxPercent > 0 ? "\n📉 *Fee (" + withTaxPercent + "%):* ₹" + taxAmt.toFixed(2) : "";

var adminText = "";
if (isCrypto) {
  adminText = "🔔 *New USDT (BEP20) Withdrawal Request!* 💎\n\n" +
    "👤 *User:* [" + user.first_name + "](tg://user?id=" + user.telegramid + ")\n" +
    "🆔 *User ID:* `" + user.telegramid + "`\n" +
    "💎 *Method:* USDT (BEP20 / BSC)\n" +
    "💰 *Amount in INR:* ₹" + reqAmount.toFixed(2) + taxAdminText + "\n" +
    "💎 *Net USDT to Send:* `" + netUSDT + " USDT`\n" +
    "📊 *Exchange Rate:* 1 USDT = ₹" + usdtRate.toFixed(2) + "\n" +
    "📁 *BEP20 Address:* `" + usdt + "`\n" +
    "🌐 *Network:* Binance Smart Chain (BEP20)\n" +
    "🆔 *Request ID:* #" + wid + "\n" +
    "📅 *Date & Time:* " + nowTime + "\n\n" +
    "⚡️ *Click an action below:*";
} else {
  adminText = "🔔 *New UPI Withdrawal Request!* 🇮🇳\n\n" +
    "👤 *User:* [" + user.first_name + "](tg://user?id=" + user.telegramid + ")\n" +
    "🆔 *User ID:* `" + user.telegramid + "`\n" +
    "💰 *Amount:* ₹" + reqAmount.toFixed(2) + taxAdminText + "\n" +
    "💵 *Net Payout:* ₹" + netPayoutINR.toFixed(2) + "\n" +
    "🏦 *UPI ID:* `" + upi + "`\n" +
    "🆔 *Request ID:* #" + wid + "\n" +
    "📅 *Date & Time:* " + nowTime + "\n\n" +
    "⚡️ *Click an action below:*";
}

// Send to Admin
if (adm) {
  Bot.setProperty("LastCreatedWithID", wid);
  Api.sendMessage({
    chat_id: adm,
    text: adminText,
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: adminButtons },
    on_result: "/save_with_msg",
    bb_options: { wid: wid }
  });
}

// User Confirmation Message
if (isCrypto) {
  var taxNotice = withTaxPercent > 0 ? "\n📉 *Fee (" + withTaxPercent + "%):* -₹" + taxAmt.toFixed(2) : "";
  Bot.sendMessage(
    "✅ *USDT Withdrawal Request Submitted!* 🚀\n\n" +
    "💎 *USDT to Receive:* `" + netUSDT + " USDT`\n" +
    "💰 *Amount in INR:* ₹" + reqAmount.toFixed(2) + taxNotice + "\n" +
    "📊 *Exchange Rate:* 1 USDT = ₹" + usdtRate.toFixed(2) + "\n" +
    "📁 *BEP20 Wallet Address:*\n`" + usdt + "`\n" +
    "🌐 *Network:* Binance Smart Chain (BEP20)\n" +
    "🆔 *Request ID:* #" + wid + "\n" +
    "⏳ *Processing Time:* 1 to 4 Hours\n\n" +
    "🔔 *You will receive an automatic notification once approved!*",
    { parse_mode: "Markdown" }
  );
} else {
  var taxUserNotice = withTaxPercent > 0 ? "\n📉 *Fee (" + withTaxPercent + "%):* -₹" + taxAmt.toFixed(2) + "\n💵 *Net Payout:* ₹" + netPayoutINR.toFixed(2) : "";
  Bot.sendMessage(
    "✅ *Withdrawal Request Submitted Successfully!* 🚀\n\n" +
    "💰 *Amount Requested:* ₹" + reqAmount.toFixed(2) + taxUserNotice + "\n" +
    "🏦 *UPI Address:* `" + upi + "`\n" +
    "🆔 *Request ID:* #" + wid + "\n" +
    "⏳ *Processing Time:* 1 to 4 Hours\n\n" +
    "🔔 *You will receive an automatic notification once approved!*",
    { parse_mode: "Markdown" }
  );
}
