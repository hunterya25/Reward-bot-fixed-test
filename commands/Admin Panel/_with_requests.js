/*CMD
  command: /with_requests
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

var mm = User.getProperty("adminid");
var pendingW = Bot.getProperty("PendingWithdrawals", []);

if (!pendingW || pendingW.length == 0) {
  var emptyText = "💸 *Withdrawal Requests Management*\n\n🎉 *No pending withdrawals!* All requests have been processed.";
  var inl = [[{ text: "◀ Back To Panel", callback_data: "/admin" }]];
  if (mm) {
    Api.editMessageText({
      message_id: mm,
      text: emptyText,
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      reply_markup: { inline_keyboard: inl }
    });
  } else {
    Api.sendMessage({
      text: emptyText,
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      reply_markup: { inline_keyboard: inl }
    });
  }
  return;
}

// 5 Requests Per Page Pagination
var perPage = 5;
var page = params ? parseInt(params) : 1;
if (isNaN(page) || page < 1) { page = 1; }
var totalPages = Math.ceil(pendingW.length / perPage);
if (page > totalPages) { page = totalPages; }

var startIndex = (page - 1) * perPage;
var endIndex = Math.min(startIndex + perPage, pendingW.length);
var pageItems = pendingW.slice(startIndex, endIndex);

var txt = "💸 *Pending Withdrawal Requests (" + pendingW.length + " Total)*\n" +
  "📄 *Page " + page + " of " + totalPages + "*\n\n";

var inl = [];

for (var i = 0; i < pageItems.length; i++) {
  var wid = pageItems[i];
  var wData = Bot.getProperty("With_" + wid);
  if (wData) {
    var itemNo = startIndex + i + 1;
    txt += "🔹 *" + itemNo + ". #" + wid + "* ➔ *₹" + wData.amount + "* | `" + wData.upi + "`\n";
    txt += "   👤 User: " + wData.first_name + " (`" + wData.user_id + "`)\n\n";
    inl.push([
      { text: "✅ Pay ₹" + wData.amount + " (#" + wid + ")", callback_data: "/app_with " + wid + " " + page },
      { text: "❌ Reject", callback_data: "/rej_with " + wid + " " + page }
    ]);
  }
}

// Pagination Controls Row
var navRow = [];
if (page > 1) {
  navRow.push({ text: "◀️ Previous", callback_data: "/with_requests " + (page - 1) });
}
navRow.push({ text: "📄 " + page + "/" + totalPages, callback_data: "/with_requests " + page });
if (page < totalPages) {
  navRow.push({ text: "Next ▶️", callback_data: "/with_requests " + (page + 1) });
}
if (navRow.length > 0) {
  inl.push(navRow);
}

// Bottom Actions Row
inl.push([
  { text: "🔄 Refresh", callback_data: "/with_requests " + page },
  { text: "◀ Back To Panel", callback_data: "/admin" }
]);

if (mm) {
  Api.editMessageText({
    message_id: mm,
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
