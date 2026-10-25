/*CMD
  command: /my_referrals
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

var myRefs = Bot.getProperty("UserReferrals_" + user.telegramid, []);
if (!myRefs) { myRefs = []; }

if (myRefs.length === 0) {
  var emptyText = "👥 *Your Referred Friends*\n" +
    "• ━━━━━━━━━━━━━━━━━━━━ •\n\n" +
    "ℹ️ *You haven't referred any friends yet!*\n\n" +
    "Share your referral link with friends. Whenever they complete tasks, you will earn *₹0.50 per task* lifetime!\n\n" +
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
var totalPages = Math.ceil(myRefs.length / perPage);
if (page > totalPages) { page = totalPages; }

var startIndex = (page - 1) * perPage;
var endIndex = Math.min(startIndex + perPage, myRefs.length);
var pageItems = myRefs.slice(startIndex, endIndex);

var txt = "👥 *Your Referred Friends (" + myRefs.length + " Total)*\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "📄 *Page " + page + " of " + totalPages + "*\n\n";

for (var i = 0; i < pageItems.length; i++) {
  var ref = pageItems[i];
  var num = startIndex + i + 1;
  var uname = ref.username ? " (@" + ref.username + ")" : "";
  var tasksCount = ref.tasks_completed || 0;
  var earnedAmt = ref.total_earned || 0;
  var rate = ref.commission_rate || Bot.getProperty("RefereeRate_" + ref.id) || 0.5;

  txt += "🔹 *" + num + ". " + ref.name + "*" + uname + "\n" +
    "   🆔 User ID: `" + ref.id + "`\n" +
    "   📅 Joined: " + (ref.joined || "N/A") + "\n" +
    "   💎 Commission Rate: *₹" + parseFloat(rate).toFixed(2) + " / task* (Lifetime)\n" +
    "   📋 Tasks Completed: *" + tasksCount + "*\n" +
    "   💰 Earned From This Friend: *₹" + (typeof earnedAmt === "number" ? earnedAmt.toFixed(2) : earnedAmt) + "*\n\n";
}

txt += "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "💡 _You receive commission automatically every time a referred friend completes a task!_";

var inl = [];

// Navigation Row
var navRow = [];
if (page > 1) {
  navRow.push({ text: "◀️ Previous", callback_data: "/my_referrals " + (page - 1) });
}
navRow.push({ text: "📄 " + page + "/" + totalPages, callback_data: "/my_referrals " + page });
if (page < totalPages) {
  navRow.push({ text: "Next ▶️", callback_data: "/my_referrals " + (page + 1) });
}
if (navRow.length > 0) {
  inl.push(navRow);
}

// Action Row
inl.push([
  { text: "🔄 Refresh", callback_data: "/my_referrals " + page },
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
