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
    Bot.sendInlineKeyboard(inl, emptyText);
  }
  return;
}

var txt = "💸 *Pending Withdrawal Requests (" + pendingW.length + ")*\n\n";
var inl = [];

for (var i = 0; i < pendingW.length && i < 8; i++) {
  var wid = pendingW[i];
  var wData = Bot.getProperty("With_" + wid);
  if (wData) {
    txt += "🔹 *#" + wid + "* ➔ ₹" + wData.amount + " | UPI: `" + wData.upi + "`\n";
    txt += "   👤 User: " + wData.first_name + " (`" + wData.user_id + "`)\n\n";
    inl.push([
      { text: "✅ Pay ₹" + wData.amount + " (#" + wid + ")", callback_data: "/app_with " + wid },
      { text: "❌ Reject", callback_data: "/rej_with " + wid }
    ]);
  }
}

inl.push([{ text: "🔄 Refresh", callback_data: "/with_requests" }, { text: "◀ Back To Panel", callback_data: "/admin" }]);

if (mm) {
  Api.editMessageText({
    message_id: mm,
    text: txt,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
} else {
  Bot.sendInlineKeyboard(inl, txt);
}
