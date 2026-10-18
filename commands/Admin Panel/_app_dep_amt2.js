/*CMD
  command: /app_dep_amt2
  help: 
  need_reply: true
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

var did = User.getProperty("target_dep_id");
if (!did) {
  Bot.sendMessage("❌ Deposit session expired. Please try again.");
  return;
}

var customAmt = parseFloat(message);
if (isNaN(customAmt) || customAmt <= 0) {
  Bot.sendMessage("❌ *Invalid amount!* Please enter a positive number (e.g. 50, 100):");
  Bot.runCommand("/app_dep_amt2");
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

depData.status = "Approved";
depData.amount = customAmt;
depData.approved_at = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
Bot.setProperty("Deposit_" + did, depData, "json");

// Credit user balance
let bal = Libs.ResourcesLib.anotherUserRes("balance", depData.user_id);
bal.add(+customAmt);

// Update Global Stats
var totalDepRes = Libs.ResourcesLib.anotherChatRes("totaldeposit", "global");
totalDepRes.add(+customAmt);

// Remove from Pending List
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
var newHis = "✅ *Deposit Approved:*\n📅 Time: " + depData.approved_at + "\n💰 Amount: ₹" + customAmt.toFixed(2) + "\n🆔 Status: Credited (#" + did + ")\n\n" + his;
Bot.setProperty("history" + depData.user_id, newHis);

// Notify User
var userMsg = "🎉 *Deposit Approved & Balance Credited!* 🎉\n\n" +
  "💰 *Amount Added:* ₹" + customAmt.toFixed(2) + "\n" +
  "💼 *New Deposit Balance:* ₹" + bal.value().toFixed(2) + "\n" +
  "🆔 *Deposit ID:* #" + did + "\n\n" +
  "🚀 *You can now create and publish new tasks in the bot!*";

Bot.sendMessageToChatWithId(depData.user_id, userMsg, { parse_mode: "Markdown" });

// Confirm to Admin
Bot.sendMessage("✅ *Deposit #" + did + " Approved with Custom Amount ₹" + customAmt.toFixed(2) + "!*\n\nUser `" + depData.user_id + "` has been credited.");
User.setProperty("target_dep_id", null);
