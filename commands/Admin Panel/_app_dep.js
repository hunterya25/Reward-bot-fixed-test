/*CMD
  command: /app_dep
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

var did = params ? params.trim() : "";
if (!did) {
  Bot.sendMessage("❌ Deposit ID missing!");
  return;
}

var depData = Bot.getProperty("Deposit_" + did);
if (!depData) {
  Bot.sendMessage("❌ Deposit record not found for #" + did);
  return;
}

if (depData.status == "Approved") {
  Bot.sendMessage("ℹ️ This deposit is already Approved!");
  return;
}

if (depData.status == "Rejected") {
  Bot.sendMessage("⚠️ This deposit was already Rejected!");
  return;
}

var creditAmount = parseFloat(depData.amount);
if (isNaN(creditAmount) || creditAmount <= 0) {
  Bot.sendMessage("❌ Invalid deposit amount!");
  return;
}

depData.status = "Approved";
depData.approved_at = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
Bot.setProperty("Deposit_" + did, depData, "json");

// 💰 Credit user's Deposit Balance (with Bonus if applicable)
var depBonusPercent = parseFloat(Bot.getProperty("DepositBonusPercent", 0));
var bonusAmt = 0;
if (depBonusPercent > 0) {
  bonusAmt = (creditAmount * depBonusPercent) / 100;
}
var totalCredit = creditAmount + bonusAmt;

let bal = Libs.ResourcesLib.anotherUserRes("balance", depData.user_id);
bal.add(+totalCredit);

// Update Global Deposit Counter
var totalDepRes = Libs.ResourcesLib.anotherChatRes("totaldeposit", "global");
totalDepRes.add(+creditAmount);

// Remove from Pending Deposits list
var pendingD = Bot.getProperty("PendingDeposits", []);
var newPending = [];
for (var i in pendingD) {
  if (pendingD[i] != did) {
    newPending.push(pendingD[i]);
  }
}
Bot.setProperty("PendingDeposits", newPending, "json");

// Log into user history
var his = Bot.getProperty("history" + depData.user_id) || "";
var newHis = "✅ *Deposit Approved:*\n📅 Time: " + depData.approved_at + "\n💰 Amount: ₹" + creditAmount.toFixed(2) + "\n🆔 Status: Credited (#" + did + ")\n\n" + his;
Bot.setProperty("history" + depData.user_id, newHis);

// Notify User
var userMsg = "🎉 *Deposit Approved & Balance Credited!* 🎉\n\n" +
  "💰 *Amount Added:* ₹" + creditAmount.toFixed(2) + "\n" +
  "💼 *New Deposit Balance:* ₹" + bal.value().toFixed(2) + "\n" +
  "🆔 *Deposit ID:* #" + did + "\n\n" +
  "🚀 *You can now create and publish new tasks in the bot!*";

Bot.sendMessageToChatWithId(depData.user_id, userMsg, { parse_mode: "Markdown" });

// Update Admin Message
var updatedAdminText = "✅ *Deposit #" + did + " Successfully Approved!*\n\n" +
  "👤 *User:* [" + depData.first_name + "](tg://user?id=" + depData.user_id + ") (`" + depData.user_id + "`)\n" +
  "💰 *Amount Credited:* ₹" + creditAmount.toFixed(2) + "\n" +
  "📊 *User's Total Balance:* ₹" + bal.value().toFixed(2) + "\n" +
  "📅 *Approved At:* " + depData.approved_at;

if (request.message && request.message.message_id) {
  Api.editMessageText({
    message_id: request.message.message_id,
    text: updatedAdminText,
    parse_mode: "Markdown"
  });
} else {
  Bot.sendMessage(updatedAdminText, { parse_mode: "Markdown" });
}
