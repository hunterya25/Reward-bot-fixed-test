/*CMD
  command: /rej_dep
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
  Bot.sendMessage("⚠️ Cannot reject: This deposit was already Approved!");
  return;
}

if (depData.status == "Rejected") {
  Bot.sendMessage("ℹ️ This deposit is already Rejected.");
  return;
}

depData.status = "Rejected";
depData.rejected_at = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
Bot.setProperty("Deposit_" + did, depData, "json");

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
var newHis = "❌ *Deposit Rejected:*\n📅 Time: " + depData.rejected_at + "\n💰 Intended Amount: ₹" + depData.amount + "\n🆔 Status: Verification Failed (#" + did + ")\n\n" + his;
Bot.setProperty("history" + depData.user_id, newHis);

// Notify User
var userMsg = "❌ *Deposit Verification Failed*\n\n" +
  "Your deposit payment proof of *₹" + depData.amount + "* (#" + did + ") could not be verified by the administrator.\n\n" +
  "ℹ️ *Common reasons:* Incomplete screenshot, duplicate receipt, or funds not received.\n" +
  "If this is an error, please contact 📞 *Support* with transaction details.";

Bot.sendMessageToChatWithId(depData.user_id, userMsg, { parse_mode: "Markdown" });

// Update Admin Message
var updatedAdminText = "❌ *Deposit #" + did + " Rejected!*\n\n" +
  "👤 *User:* [" + depData.first_name + "](tg://user?id=" + depData.user_id + ") (`" + depData.user_id + "`)\n" +
  "💰 *Intended Amount:* ₹" + depData.amount + "\n" +
  "📅 *Rejected At:* " + depData.rejected_at;

if (request.message && request.message.message_id) {
  Api.editMessageText({
    message_id: request.message.message_id,
    text: updatedAdminText,
    parse_mode: "Markdown"
  });
} else {
  Bot.sendMessage(updatedAdminText, { parse_mode: "Markdown" });
}
