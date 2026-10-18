/*CMD
  command: /ref_history
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Referral

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var refHistory = Bot.getProperty("ReferralHistory_" + user.telegramid, []);
if (!refHistory) { refHistory = []; }

if (refHistory.length === 0) {
  var emptyText = "📜 *Referral Commission History*\n" +
    "• ━━━━━━━━━━━━━━━━━━━━ •\n\n" +
    "ℹ️ *No referral earnings recorded yet.*\n\n" +
    "Whenever a referred friend completes a task, you will receive *₹0.50* directly to your payout balance and it will appear here!\n\n" +
    "• ━━━━━━━━━━━━━━━━━━━━ •";

  var emptyInl = [
    [{ text: "🔙 Back to Refer & Earn", callback_data: "/refer" }]
  ];

  if (request.message && request.message.message_id) {
    Api.editMessageText({
      message_id: request.message.message_id,
      text: emptyText,
      parse_mode: "Markdown",
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

var perPage = 5;
var page = params ? parseInt(params) : 1;
if (isNaN(page) || page < 1) { page = 1; }
var totalPages = Math.ceil(refHistory.length / perPage);
if (page > totalPages) { page = totalPages; }

var startIndex = (page - 1) * perPage;
var endIndex = Math.min(startIndex + perPage, refHistory.length);
var pageItems = refHistory.slice(startIndex, endIndex);

var txt = "📜 *Referral Commission History (" + refHistory.length + " Total)*\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "📄 *Page " + page + " of " + totalPages + "*\n\n";

for (var i = 0; i < pageItems.length; i++) {
  var item = pageItems[i];
  var num = startIndex + i + 1;
  var amtStr = typeof item.amount === "number" ? item.amount.toFixed(2) : item.amount;

  txt += "🔹 *" + num + ". Commission Earned: +₹" + amtStr + "* 💰\n" +
    "   👤 Friend: " + (item.referee_name || "Referred User") + " (`" + item.referee_id + "`)\n" +
    "   📋 Task: *" + (item.task_name || "Task") + "*\n" +
    "   📅 Date: " + (item.date || "N/A") + "\n\n";
}

txt += "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "💎 _Earn ₹0.50 lifetime for every single task your friends complete!_";

var inl = [];

// Navigation Row
var navRow = [];
if (page > 1) {
  navRow.push({ text: "◀️ Previous", callback_data: "/ref_history " + (page - 1) });
}
navRow.push({ text: "📄 " + page + "/" + totalPages, callback_data: "/ref_history " + page });
if (page < totalPages) {
  navRow.push({ text: "Next ▶️", callback_data: "/ref_history " + (page + 1) });
}
if (navRow.length > 0) {
  inl.push(navRow);
}

// Action Row
inl.push([
  { text: "🔄 Refresh", callback_data: "/ref_history " + page },
  { text: "🔙 Back to Refer & Earn", callback_data: "/refer" }
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
