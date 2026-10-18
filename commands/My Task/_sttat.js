/*CMD
  command: /sttat
  help: 
  need_reply: false
  auto_retry_time: 
  folder: My Task

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var b = params;
if (!b) { return; }

var bbi = Bot.getProperty("Task+" + b);
if (!bbi) {
  Bot.sendMessage("❌ Task not found!");
  return;
}

var adm = Bot.getProperty("adminID");
if (user.telegramid != bbi.admin && user.telegramid != adm) {
  if (request && request.id) {
    Api.answerCallbackQuery({
      callback_query_id: request.id,
      text: "❌ You are not authorized to view or edit this task!",
      show_alert: true
    });
  } else {
    Bot.sendMessage("⛔️ Access Denied!");
  }
  return;
}

// Handle status toggle if triggered via button click
if (request && request.id && request.data && request.data.indexOf("/sttat") === 0) {
  var bsCurrent = Bot.getProperty("Status?" + b, "On");
  var bsNext = (bsCurrent == "On") ? "Off" : "On";
  Bot.setProperty("Status?" + b, bsNext, "string");
  Api.answerCallbackQuery({
    callback_query_id: request.id,
    text: "Task is now " + (bsNext == "On" ? "▶️ Active" : "⏸ Stopped"),
    show_alert: false
  });
}

var bs = Bot.getProperty("Status?" + b, "On");
var bsLabel = (bs == "On") ? "▶️ Active" : "⏸ Stopped";

var nam = bbi.name;
var des = bbi.des || "No description";
var clm = bbi.claim || 0;
var rew = parseFloat(bbi.payment) || 0;
var id = bbi.id;
var link = bbi.link || "None";
var use = Libs.ResourcesLib.anotherChatRes("total_claimed", id).value() || 0;

var txt = "⚙️ <b>Manage Task: " + nam + "</b>\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "🆔 <b>Task ID:</b> <code>#" + id + "</code>\n" +
  "👁️ <b>Title:</b> " + nam + "\n" +
  "🔗 <b>Task Link:</b> <code>" + link + "</code>\n" +
  "💵 <b>Reward:</b> ₹" + rew.toFixed(2) + " per user\n" +
  "👥 <b>Completions:</b> <code>" + use + " / " + clm + " users</code>\n" +
  "📃 <b>Description:</b> " + des + "\n" +
  "ℹ️ <b>Status:</b> <b>" + bsLabel + "</b>\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •";

var inl = [
  [
    { text: bsLabel, callback_data: "/sttat " + nam },
    { text: "🏷 Edit Title", callback_data: "/etitle " + nam }
  ],
  [
    { text: "💵 Edit Price", callback_data: "/eprice " + nam },
    { text: "🔗 Edit Link", callback_data: "/elink " + nam }
  ],
  [
    { text: "👥 Edit Users", callback_data: "/eclaim " + nam },
    { text: "📍 Edit Description", callback_data: "/des " + nam }
  ],
  [
    { text: "✍ Edit Demo", callback_data: "/edemo " + nam },
    { text: "🗑 Delete Task", callback_data: "/delete " + nam }
  ],
  [
    { text: "◀️ Back To My Tasks", callback_data: "🏟 My Tasks" }
  ]
];

if (request && request.message && request.message.message_id) {
  Api.editMessageText({
    message_id: request.message.message_id,
    text: txt,
    parse_mode: "html",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
} else {
  Api.sendMessage({
    text: txt,
    parse_mode: "html",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
}
