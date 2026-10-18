/*CMD
  command: /my_withdrawals
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Balance

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var userWithList = User.getProperty("UserWithdrawals", []);
if (!userWithList) { userWithList = []; }

// Auto-sync any pending withdrawals for this user if not already in list
var pendingW = Bot.getProperty("PendingWithdrawals", []);
if (pendingW && pendingW.length > 0) {
  var changed = false;
  for (var k = 0; k < pendingW.length; k++) {
    var pwId = pendingW[k];
    if (userWithList.indexOf(pwId) === -1) {
      var pwData = Bot.getProperty("With_" + pwId);
      if (pwData && pwData.user_id == user.telegramid) {
        userWithList.push(pwId);
        changed = true;
      }
    }
  }
  if (changed) {
    User.setProperty("UserWithdrawals", userWithList, "json");
  }
}

if (userWithList.length === 0) {
  var emptyText = "📜 *Your Withdrawal Transactions & Status*\n" +
    "• ━━━━━━━━━━━━━━━━━ •\n\n" +
    "ℹ️ *No withdrawal requests found yet.*\n\n" +
    "🚀 Complete tasks to earn coins and request payouts to your UPI!\n\n" +
    "• ━━━━━━━━━━━━━━━━━ •";

  var emptyInl = [
    [{ text: "🤑 Request Withdrawal", callback_data: "/withdraw" }],
    [{ text: "💰 Back to Balance", callback_data: "/balance" }]
  ];

  if (request.message && request.message.message_id) {
    Api.editMessageText({
      message_id: request.message.message_id,
      text: emptyText,
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      reply_markup: { inline_keyboard: emptyInl }
    });
  } else {
    Api.sendMessage({
      text: emptyText,
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      reply_markup: { inline_keyboard: emptyInl }
    });
  }
  return;
}

// 5 Requests per page
var perPage = 5;
var page = params ? parseInt(params) : 1;
if (isNaN(page) || page < 1) { page = 1; }
var totalPages = Math.ceil(userWithList.length / perPage);
if (page > totalPages) { page = totalPages; }

var startIndex = (page - 1) * perPage;
var endIndex = Math.min(startIndex + perPage, userWithList.length);
var pageItems = userWithList.slice(startIndex, endIndex);

var txt = "📜 *Your Withdrawal Transactions & Status*\n" +
  "• ━━━━━━━━━━━━━━━━━ •\n" +
  "📊 *Total Requests:* " + userWithList.length + " | *Page:* " + page + " of " + totalPages + "\n" +
  "• ━━━━━━━━━━━━━━━━━ •\n\n";

for (var i = 0; i < pageItems.length; i++) {
  var wid = pageItems[i];
  var wData = Bot.getProperty("With_" + wid);
  var num = startIndex + i + 1;

  if (wData) {
    var statusBadge = "⏳ *Pending Review*";
    var dateInfo = wData.created_at || "N/A";

    if (wData.status === "Approved") {
      statusBadge = "✅ *Paid & Settled*";
      if (wData.approved_at) {
        dateInfo = wData.approved_at;
      }
    } else if (wData.status === "Rejected") {
      statusBadge = "❌ *Rejected & Refunded*";
      if (wData.rejected_at) {
        dateInfo = wData.rejected_at;
      }
    }

    var amtStr = typeof wData.amount === "number" ? wData.amount.toFixed(2) : wData.amount;

    txt += "🔹 *" + num + ". Request #" + wid + "*\n" +
      "   💰 *Amount:* ₹" + amtStr + "\n" +
      "   🏦 *UPI:* `" + wData.upi + "`\n" +
      "   📅 *Date:* " + dateInfo + "\n" +
      "   📊 *Status:* " + statusBadge + "\n\n";
  } else {
    txt += "🔹 *" + num + ". Request #" + wid + "*\n" +
      "   ℹ️ Details archived\n\n";
  }
}

txt += "• ━━━━━━━━━━━━━━━━━ •\n" +
  "💡 *Status Legend:*\n" +
  "⏳ *Pending Review* — Under admin processing\n" +
  "✅ *Paid & Settled* — Money credited to your UPI\n" +
  "❌ *Rejected & Refunded* — Balance returned to account";

var inl = [];

// Pagination Controls Row
var navRow = [];
if (page > 1) {
  navRow.push({ text: "◀️ Previous", callback_data: "/my_withdrawals " + (page - 1) });
}
navRow.push({ text: "📄 " + page + "/" + totalPages, callback_data: "/my_withdrawals " + page });
if (page < totalPages) {
  navRow.push({ text: "Next ▶️", callback_data: "/my_withdrawals " + (page + 1) });
}
if (navRow.length > 0) {
  inl.push(navRow);
}

// Action Row
inl.push([
  { text: "🔄 Refresh", callback_data: "/my_withdrawals " + page },
  { text: "🤑 New Withdraw", callback_data: "/withdraw" }
]);

// Back Row
inl.push([
  { text: "💰 Back to Balance", callback_data: "/balance" }
]);

if (request.message && request.message.message_id) {
  Api.editMessageText({
    message_id: request.message.message_id,
    text: txt,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
} else {
  Api.sendMessage({
    text: txt,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
}
