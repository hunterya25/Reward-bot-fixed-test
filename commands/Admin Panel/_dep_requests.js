/*CMD
  command: /dep_requests
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
var pendingD = Bot.getProperty("PendingDeposits", []);

if (!pendingD || pendingD.length == 0) {
  var emptyText = "📥 *Deposit Requests Management*\n\n🎉 *No pending deposit requests!* All deposits have been verified.";
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

var txt = "📥 *Pending Deposit Requests (" + pendingD.length + ")*\n\n";
var inl = [];

for (var i = 0; i < pendingD.length && i < 8; i++) {
  var did = pendingD[i];
  var dData = Bot.getProperty("Deposit_" + did);
  if (dData) {
    txt += "🔹 *#" + did + "* ➔ ₹" + dData.amount + "\n";
    txt += "   👤 User: " + dData.first_name + " (`" + dData.user_id + "`)\n\n";
    inl.push([
      { text: "✅ Approve ₹" + dData.amount + " (#" + did + ")", callback_data: "/app_dep " + did },
      { text: "❌ Reject", callback_data: "/rej_dep " + did }
    ]);
  }
}

inl.push([{ text: "🔄 Refresh", callback_data: "/dep_requests" }, { text: "◀ Back To Panel", callback_data: "/admin" }]);

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
