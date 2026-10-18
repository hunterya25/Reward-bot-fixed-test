/*CMD
  command: /withdraw
  help: 
  need_reply: true
  auto_retry_time: 
  folder: Withdrawal
  answer: *📤 Enter Amount of ₹1 to Make Withdrawal*

  <<KEYBOARD

  KEYBOARD
  aliases: 🤑 withdraw
  group: 
CMD*/

var wit = Bot.getProperty("Withdraw_status");
var adm = Bot.getProperty("adminID");

if (wit == "❌" && user.telegramid != adm) {
  Bot.sendMessage("⛔️ *Withdrawals are temporarily disabled by Administration.* Please check back later.");
  return;
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

if (!isNumeric(message)) {
  Bot.sendMessage("❌ Send a Valid Number");
  Bot.runCommand("/withdraw");
  return;
}

var minWithdrawINR = 1; // Minimum ₹1 withdrawal

var balance = Libs.ResourcesLib.userRes("Available_For_Payout");
var upi = User.getProperty("upi_id");

if (!upi) {
  Bot.sendMessage("*🗂 You Need To Setup Your UPI ID First!*\n\nGo to ⚙️ *Settings* ➔ *Wallet* to set your UPI address.");
  return;
}

var reqAmount = parseFloat(message);

// Withdrawal Amount Validation
if (reqAmount < minWithdrawINR) {
  Bot.sendMessage("⚠️ *Minimum Withdrawal is ₹" + minWithdrawINR + ".*\n\n💰 *Your Available Balance:* ₹" + balance.value().toFixed(2));
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

// Deduct Balance from Available_For_Payout
balance.remove(reqAmount);

var wid = Libs.Random.randomInt(100000, 999999).toString();
var nowTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

var withRecord = {
  id: wid,
  user_id: user.telegramid,
  first_name: user.first_name,
  username: user.username || "",
  amount: reqAmount,
  upi: upi,
  status: "Pending",
  created_at: nowTime
};

Bot.setProperty("With_" + wid, withRecord, "json");

// Add to Global Pending Withdrawals List
var pendingW = Bot.getProperty("PendingWithdrawals", []);
if (!pendingW) { pendingW = []; }
pendingW.push(wid);
Bot.setProperty("PendingWithdrawals", pendingW, "json");

// Log into user history
var his = Bot.getProperty("history" + user.telegramid) || "";
var newHis = "⏳ *Withdrawal Requested:*\n📅 Time: " + nowTime + "\n💰 Amount: ₹" + reqAmount.toFixed(2) + " to `" + upi + "`\n🆔 Status: Pending Review (#" + wid + ")\n\n" + his;
Bot.setProperty("history" + user.telegramid, newHis);

// Interactive Buttons for Admin
var adminButtons = [
  [
    { text: "✅ Approve Payout", callback_data: "/app_with " + wid },
    { text: "❌ Reject & Refund", callback_data: "/rej_with " + wid }
  ]
];

var adminText = "🔔 *New Withdrawal Request!* 🔔\n\n" +
  "👤 *User:* [" + user.first_name + "](tg://user?id=" + user.telegramid + ")\n" +
  "🆔 *User ID:* `" + user.telegramid + "`\n" +
  "💰 *Amount:* ₹" + reqAmount.toFixed(2) + "\n" +
  "🏦 *UPI ID:* `" + upi + "`\n" +
  "🆔 *Request ID:* #" + wid + "\n" +
  "📅 *Date & Time:* " + nowTime + "\n\n" +
  "⚡️ *Click an action below:*";

// Send to Admin
if (adm) {
  Api.sendMessage({
    chat_id: adm,
    text: adminText,
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: adminButtons }
  });
}

// User Confirmation Message
Bot.sendMessage(
  "✅ *Withdrawal Request Submitted Successfully!* 🚀\n\n" +
  "💰 *Amount:* ₹" + reqAmount.toFixed(2) + "\n" +
  "🏦 *UPI Address:* `" + upi + "`\n" +
  "🆔 *Request ID:* #" + wid + "\n" +
  "⏳ *Processing Time:* 1 to 4 Hours\n\n" +
  "🔔 *You will receive an automatic notification once approved!*",
  { parse_mode: "Markdown" }
);

