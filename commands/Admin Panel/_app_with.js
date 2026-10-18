/*CMD
  command: /app_with
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
  Bot.sendMessage("ℹ️ This withdrawal is already Approved!");
  return;
}

if (withData.status == "Rejected") {
  Bot.sendMessage("⚠️ This withdrawal was already Rejected & refunded!");
  return;
}

withData.status = "Approved";
withData.approved_at = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
Bot.setProperty("With_" + wid, withData, "json");

// Update Global Stats
var totalWithRes = Libs.ResourcesLib.anotherChatRes("totalwithdraw", "global");
totalWithRes.add(+withData.amount);

// Remove from Pending List
var pendingW = Bot.getProperty("PendingWithdrawals", []);
var newPending = [];
for (var i in pendingW) {
  if (pendingW[i] != wid) {
    newPending.push(pendingW[i]);
  }
}
Bot.setProperty("PendingWithdrawals", newPending, "json");

// Log approved status in user history
var his = Bot.getProperty("history" + withData.user_id) || "";
var newHis = "✅ *Withdrawal Paid:*\n📅 Time: " + withData.approved_at + "\n💰 Amount: ₹" + withData.amount + " to `" + withData.upi + "`\n🆔 Status: Completed (#" + wid + ")\n\n" + his;
Bot.setProperty("history" + withData.user_id, newHis);

// Notify User
var userMsg = "🎉 *Congratulations! Withdrawal Approved & Paid!* 🥳\n\n" +
  "💰 *Amount Credited:* ₹" + withData.amount + "\n" +
  "🏦 *UPI ID:* `" + withData.upi + "`\n" +
  "🆔 *Request ID:* #" + wid + "\n" +
  "📅 *Completed:* " + withData.approved_at + "\n\n" +
  "🚀 *Thank you for completing tasks and earning with us!*";

Bot.sendMessageToChatWithId(withData.user_id, userMsg, { parse_mode: "Markdown" });

// Update Admin Message
var updatedAdminText = "✅ *Withdrawal #" + wid + " Successfully Approved & Settled!*\n\n" +
  "👤 *User:* [" + withData.first_name + "](tg://user?id=" + withData.user_id + ") (`" + withData.user_id + "`)\n" +
  "💰 *Amount Paid:* ₹" + withData.amount + "\n" +
  "🏦 *UPI ID:* `" + withData.upi + "`\n" +
  "📅 *Approved At:* " + withData.approved_at;

if (request.message && request.message.message_id) {
  Api.editMessageText({
    message_id: request.message.message_id,
    text: updatedAdminText,
    parse_mode: "Markdown"
  });
} else {
  Bot.sendMessage(updatedAdminText, { parse_mode: "Markdown" });
}
