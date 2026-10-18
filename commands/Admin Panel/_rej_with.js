/*CMD
  command: /rej_with
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

var prms = params ? params.trim().split(" ") : [];
var wid = prms[0] || "";
var returnPage = prms[1] ? parseInt(prms[1]) : 1;

if (!wid) {
  Bot.sendMessage("❌ Withdrawal ID missing!");
  return;
}

var withData = Bot.getProperty("With_" + wid);
if (!withData) {
  Bot.sendMessage("❌ Withdrawal record not found for #" + wid);
  return;
}

if (withData.status == "Approved") {
  Bot.sendMessage("⚠️ Cannot reject: This withdrawal was already Approved & Paid!");
  if (request.message && request.message.message_id && prms.length <= 1) {
    Api.deleteMessage({ chat_id: adm, message_id: request.message.message_id });
  }
  return;
}

if (withData.status == "Rejected") {
  Bot.sendMessage("ℹ️ This withdrawal is already Rejected & Refunded.");
  if (request.message && request.message.message_id && prms.length <= 1) {
    Api.deleteMessage({ chat_id: adm, message_id: request.message.message_id });
  }
  return;
}

withData.status = "Rejected";
withData.rejected_at = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
Bot.setProperty("With_" + wid, withData, "json");

// 💰 Automatic Refund to User's Available_For_Payout
var bal = Libs.ResourcesLib.anotherUserRes("Available_For_Payout", withData.user_id);
bal.add(+withData.amount);

// Remove from Pending List
var pendingW = Bot.getProperty("PendingWithdrawals", []);
var newPending = [];
for (var i in pendingW) {
  if (pendingW[i] != wid) {
    newPending.push(pendingW[i]);
  }
}
Bot.setProperty("PendingWithdrawals", newPending, "json");

// Log into user history
var his = Bot.getProperty("history" + withData.user_id) || "";
var newHis = "❌ *Withdrawal Rejected & Refunded:*\n📅 Time: " + withData.rejected_at + "\n💰 Amount: ₹" + withData.amount + "\n↩️ Status: Refunded to Balance\n\n" + his;
Bot.setProperty("history" + withData.user_id, newHis);

// Notify User
var userMsg = "❌ *Withdrawal Request Notice*\n\n" +
  "Your withdrawal request of *₹" + withData.amount + "* has been *Rejected*.\n\n" +
  "💰 *Full Refund Processed:*\n" +
  "₹" + withData.amount + " has been returned to your *Available For Payout* balance.\n" +
  "📊 *Current Payout Balance:* ₹" + bal.value().toFixed(2) + "\n\n" +
  "ℹ️ *Common Reasons:* Incorrect UPI ID, inactive UPI account, or invalid details.\n" +
  "Please update your UPI in ⚙️ *Settings* or contact 📞 *Support*.";

Bot.sendMessageToChatWithId(withData.user_id, userMsg, { parse_mode: "Markdown" });

// 🗑 Auto-Delete the Separate Direct Withdrawal Message (Prevents Double-Pay)
var sepMsgId = Bot.getProperty("WithMsg_" + wid);
if (sepMsgId) {
  Api.deleteMessage({ chat_id: adm, message_id: sepMsgId });
  Bot.setProperty("WithMsg_" + wid, null);
} else if (request.message && request.message.message_id && prms.length <= 1) {
  Api.deleteMessage({ chat_id: adm, message_id: request.message.message_id });
}

// If clicked from Admin Panel, refresh the pending list
var clickedFromPanel = prms.length > 1;
if (clickedFromPanel) {
  Bot.sendMessage("❌ *Withdrawal #" + wid + " Rejected & ₹" + withData.amount + " Refunded to User!*", { parse_mode: "Markdown" });
  Bot.runCommand("/with_requests " + returnPage);
} else {
  // Clicked from separate message
  Bot.sendMessage("❌ *Withdrawal #" + wid + " Rejected & ₹" + withData.amount + " Refunded to User!*", { parse_mode: "Markdown" });
}
