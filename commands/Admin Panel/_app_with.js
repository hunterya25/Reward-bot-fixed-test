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

var adminChatId = (chat && chat.chatid) ? chat.chatid : adm;

if (withData.status == "Approved") {
  if (request.message && request.message.message_id && prms.length <= 1) {
    Api.deleteMessage({ chat_id: adminChatId, message_id: request.message.message_id });
  }
  Bot.sendMessage("ℹ️ This withdrawal is already Approved!");
  return;
}

if (withData.status == "Rejected") {
  if (request.message && request.message.message_id && prms.length <= 1) {
    Api.deleteMessage({ chat_id: adminChatId, message_id: request.message.message_id });
  }
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
var isCrypto = (withData.method === "USDT");
var his = Bot.getProperty("history" + withData.user_id) || "";
var hisDetails = isCrypto
  ? (withData.usdt_amount + " USDT (₹" + withData.amount + ") to `" + withData.crypto_address + "`")
  : ("₹" + withData.amount + " to `" + withData.upi + "`");

var newHis = "✅ *Withdrawal Paid:*\n📅 Time: " + withData.approved_at + "\n💰 Amount: " + hisDetails + "\n🆔 Status: Completed (#" + wid + ")\n\n" + his;
Bot.setProperty("history" + withData.user_id, newHis);

// Notify User
var userMsg = "";
if (isCrypto) {
  userMsg = "🎉 *Congratulations! USDT Withdrawal Approved & Paid!* 🥳\n\n" +
    "💎 *USDT Sent:* `" + withData.usdt_amount + " USDT`\n" +
    "💰 *Amount in INR:* ₹" + withData.amount + "\n" +
    "🌐 *Network:* Binance Smart Chain (BEP20)\n" +
    "📁 *Address:* `" + withData.crypto_address + "`\n" +
    "🆔 *Request ID:* #" + wid + "\n" +
    "📅 *Completed:* " + withData.approved_at + "\n\n" +
    "🚀 *Thank you for completing tasks and earning with us!*";
} else {
  userMsg = "🎉 *Congratulations! Withdrawal Approved & Paid!* 🥳\n\n" +
    "💰 *Amount Credited:* ₹" + withData.amount + "\n" +
    "🏦 *UPI ID:* `" + withData.upi + "`\n" +
    "🆔 *Request ID:* #" + wid + "\n" +
    "📅 *Completed:* " + withData.approved_at + "\n\n" +
    "🚀 *Thank you for completing tasks and earning with us!*";
}

Bot.sendMessageToChatWithId(withData.user_id, userMsg, { parse_mode: "Markdown" });

// 🗑 Auto-Delete the Separate Direct Withdrawal Message (Prevents Double-Pay)
var sepMsgId = (withData && withData.msg_id) ? withData.msg_id : Bot.getProperty("WithMsg_" + wid);
if (sepMsgId && adminChatId) {
  Api.deleteMessage({ chat_id: adminChatId, message_id: parseInt(sepMsgId) });
  Bot.setProperty("WithMsg_" + wid, null);
} else if (request.message && request.message.message_id && prms.length <= 1 && adminChatId) {
  Api.deleteMessage({ chat_id: adminChatId, message_id: request.message.message_id });
}

// If clicked from Admin Panel, refresh the pending list
var clickedFromPanel = prms.length > 1;
if (clickedFromPanel) {
  var adminFeedback = isCrypto
    ? ("✅ *Withdrawal #" + wid + " (" + withData.usdt_amount + " USDT) Approved & Paid!*")
    : ("✅ *Withdrawal #" + wid + " (₹" + withData.amount + ") Approved & Paid!*");
  Bot.sendMessage(adminFeedback, { parse_mode: "Markdown" });
  Bot.runCommand("/with_requests " + returnPage);
} else {
  // Clicked from separate message
  var directFeedback = isCrypto
    ? ("✅ *Withdrawal #" + wid + " Successfully Approved & Paid!*\n\n💎 USDT: `" + withData.usdt_amount + " USDT` (~₹" + withData.amount + ")\n📁 BEP20: `" + withData.crypto_address + "`")
    : ("✅ *Withdrawal #" + wid + " Successfully Approved & Paid!*\n\n💰 Amount: ₹" + withData.amount + "\n🏦 UPI: `" + withData.upi + "`");
  Bot.sendMessage(directFeedback, { parse_mode: "Markdown" });
}
