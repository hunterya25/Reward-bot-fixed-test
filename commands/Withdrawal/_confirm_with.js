/*CMD
  command: /confirm_with
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

var wit = Bot.getProperty("Withdraw_status", "✅");
var adm = Bot.getProperty("adminID");

if (wit == "❌" && user.telegramid != adm) {
  var maintMsg = "⛔️ *Withdrawals are temporarily disabled by Administration.* Please check back later.";
  if (request && request.message && request.message.message_id) {
    Api.editMessageText({
      message_id: request.message.message_id,
      text: maintMsg,
      parse_mode: "Markdown"
    });
  } else {
    Bot.sendMessage(maintMsg);
  }
  return;
}

var tempData = User.getProperty("temp_withdraw_data");
if (!tempData) {
  var expiredMsg = "⚠️ *This withdrawal session has expired or was already confirmed.*";
  if (request && request.message && request.message.message_id) {
    Api.editMessageText({
      message_id: request.message.message_id,
      text: expiredMsg,
      parse_mode: "Markdown"
    });
  } else {
    Bot.sendMessage(expiredMsg);
  }
  return;
}

// Immediately delete temporary property to prevent duplicate confirmations
User.deleteProperty("temp_withdraw_data");
User.deleteProperty("current_with_method");

var balance = Libs.ResourcesLib.userRes("Available_For_Payout");
if (balance.value() < tempData.amount) {
  var lowBalMsg = "⚠️ *Insufficient Available Balance!*\n\nYour balance may have changed. Available: `₹" + balance.value().toFixed(2) + "`";
  if (request && request.message && request.message.message_id) {
    Api.editMessageText({
      message_id: request.message.message_id,
      text: lowBalMsg,
      parse_mode: "Markdown"
    });
  } else {
    Bot.sendMessage(lowBalMsg);
  }
  return;
}

// Deduct balance from Available_For_Payout
balance.remove(tempData.amount);

var wid = Libs.Random.randomInt(100000, 999999).toString();
var nowTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
var isCrypto = (tempData.method === "USDT");

var withRecord = {
  id: wid,
  user_id: user.telegramid,
  first_name: user.first_name,
  username: user.username || "",
  method: tempData.method,
  amount: tempData.amount,
  tax: tempData.tax,
  tax_percent: tempData.tax_percent,
  net_amount: tempData.net_amount,
  usdt_rate: tempData.usdt_rate,
  usdt_amount: tempData.usdt_amount,
  crypto_address: tempData.crypto_address,
  network: tempData.network,
  upi: isCrypto ? null : tempData.destination,
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
  ? (tempData.usdt_amount + " USDT (₹" + tempData.amount.toFixed(2) + ") to `" + tempData.crypto_address + "`")
  : ("₹" + tempData.amount.toFixed(2) + " to `" + tempData.destination + "`");

var newHis = "⏳ *Withdrawal Requested:*\n📅 Time: " + nowTime + "\n💰 " + historyDetails + "\n🆔 Status: Pending Review (#" + wid + ")\n\n" + his;
Bot.setProperty("history" + user.telegramid, newHis);

// Interactive Buttons for Admin
var adminButtons = [
  [
    { text: "✅ Approve Payout", callback_data: "/app_with " + wid },
    { text: "❌ Reject & Refund", callback_data: "/rej_with " + wid }
  ]
];

var taxAdminText = tempData.tax > 0 ? "\n📉 *Fee (" + tempData.tax_percent + "%):* ₹" + tempData.tax.toFixed(2) : "";

var adminText = "";
if (isCrypto) {
  adminText = "🔔 *New USDT (BEP20) Withdrawal Request!* 💎\n\n" +
    "👤 *User:* [" + user.first_name + "](tg://user?id=" + user.telegramid + ")\n" +
    "🆔 *User ID:* `" + user.telegramid + "`\n" +
    "💎 *Method:* USDT (BEP20 / BSC)\n" +
    "💰 *Amount in INR:* ₹" + tempData.amount.toFixed(2) + taxAdminText + "\n" +
    "💎 *Net USDT to Send:* `" + tempData.usdt_amount + " USDT`\n" +
    "📊 *Exchange Rate:* 1 USDT = ₹" + tempData.usdt_rate.toFixed(2) + "\n" +
    "📁 *BEP20 Address:* `" + tempData.crypto_address + "`\n" +
    "🌐 *Network:* Binance Smart Chain (BEP20)\n" +
    "🆔 *Request ID:* #" + wid + "\n" +
    "📅 *Date & Time:* " + nowTime + "\n\n" +
    "⚡️ *Click an action below:*";
} else {
  adminText = "🔔 *New UPI Withdrawal Request!* 🇮🇳\n\n" +
    "👤 *User:* [" + user.first_name + "](tg://user?id=" + user.telegramid + ")\n" +
    "🆔 *User ID:* `" + user.telegramid + "`\n" +
    "💰 *Amount:* ₹" + tempData.amount.toFixed(2) + taxAdminText + "\n" +
    "💵 *Net Payout:* ₹" + tempData.net_amount.toFixed(2) + "\n" +
    "🏦 *UPI ID:* `" + tempData.destination + "`\n" +
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

// Confirmation Message for User
var userDoneText = "";
if (isCrypto) {
  var taxNotice = tempData.tax > 0 ? "\n📉 *Fee (" + tempData.tax_percent + "%):* `-₹" + tempData.tax.toFixed(2) + "`" : "";
  userDoneText = "✅ *USDT Withdrawal Request Submitted!* 🚀\n\n" +
    "💎 *USDT to Receive:* `" + tempData.usdt_amount + " USDT`\n" +
    "💰 *Amount in INR:* `₹" + tempData.amount.toFixed(2) + "`" + taxNotice + "\n" +
    "📊 *Exchange Rate:* `1 USDT = ₹" + tempData.usdt_rate.toFixed(2) + "`\n" +
    "📁 *BEP20 Wallet Address:*\n`" + tempData.crypto_address + "`\n" +
    "🌐 *Network:* Binance Smart Chain (BEP20)\n" +
    "🆔 *Request ID:* `#" + wid + "`\n" +
    "⏳ *Processing Time:* 1 to 4 Hours\n\n" +
    "🔔 *You will receive an automatic notification once approved and paid!*";
} else {
  var taxUserNotice = tempData.tax > 0 ? "\n📉 *Fee (" + tempData.tax_percent + "%):* `-₹" + tempData.tax.toFixed(2) + "`\n💵 *Net Payout:* `₹" + tempData.net_amount.toFixed(2) + "`" : "";
  userDoneText = "✅ *Withdrawal Request Submitted Successfully!* 🚀\n\n" +
    "💰 *Amount Requested:* `₹" + tempData.amount.toFixed(2) + "`" + taxUserNotice + "\n" +
    "🏦 *UPI Address:* `" + tempData.destination + "`\n" +
    "🆔 *Request ID:* `#" + wid + "`\n" +
    "⏳ *Processing Time:* 1 to 4 Hours\n\n" +
    "🔔 *You will receive an automatic notification once approved and paid!*";
}

var doneInl = [
  [
    { text: "📜 Track My Withdrawals", callback_data: "/my_withdrawals 1" },
    { text: "💰 My Balance", callback_data: "/balance" }
  ]
];

if (request && request.message && request.message.message_id) {
  Api.editMessageText({
    message_id: request.message.message_id,
    text: userDoneText,
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: doneInl }
  });
} else {
  Api.sendMessage({
    text: userDoneText,
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: doneInl }
  });
}
