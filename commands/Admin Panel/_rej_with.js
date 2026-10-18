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

var wid = params ? params.trim() : "";
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
  return;
}

if (withData.status == "Rejected") {
  Bot.sendMessage("ℹ️ This withdrawal is already Rejected & Refunded.");
  return;
}

withData.status = "Rejected";
withData.rejected_at = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
Bot.setProperty("With_" + wid, withData, "json");

// 💰 Automatic Refund to User's Available_For_Payout
let bal = Libs.ResourcesLib.anotherUserRes("Available_For_Payout", withData.user_id);
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

// Update Admin Message
var updatedAdminText = "❌ *Withdrawal #" + wid + " Rejected & Refunded!*\n\n" +
  "👤 *User:* [" + withData.first_name + "](tg://user?id=" + withData.user_id + ") (`" + withData.user_id + "`)\n" +
  "💰 *Amount Refunded:* ₹" + withData.amount + "\n" +
  "🏦 *UPI ID:* `" + withData.upi + "`\n" +
  "↩️ *Status:* Refunded back to user's wallet.";

if (request.message && request.message.message_id) {
  Api.editMessageText({
    message_id: request.message.message_id,
    text: updatedAdminText,
    parse_mode: "Markdown"
  });
} else {
  Bot.sendMessage(updatedAdminText, { parse_mode: "Markdown" });
}
