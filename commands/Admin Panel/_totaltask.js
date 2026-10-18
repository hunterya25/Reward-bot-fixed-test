/*CMD
  command: /totaltask
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

var y = params;
if (!y) { return; }
var yy = y.split("#-#-#");
var b = yy[0];
var bac = yy[1] || "1";
var bbi = Bot.getProperty("Task+" + b);

if (!bbi) {
  Bot.sendMessage("❌ Task not found!");
  return;
}

var nam = bbi.name;
var des = bbi.des || "No description";
var clm = bbi.claim || 0;
var rew = parseFloat(bbi.payment) || 0;
var id = bbi.id;
var link = bbi.link || "None";
var creator = bbi.admin || "N/A";
var bs = Bot.getProperty("Status?" + b, "On");
var bsLabel = (bs == "On") ? "▶️ Active" : "⏸ Stopped";
var use = Libs.ResourcesLib.anotherChatRes("total_claimed", id).value() || 0;

var ttxt = "🛒 <b>Admin Task Moderation: " + nam + "</b>\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "🆔 <b>Task ID:</b> <code>#" + id + "</code>\n" +
  "👤 <b>Creator:</b> <code>" + creator + "</code>\n" +
  "👁️ <b>Title:</b> " + nam + "\n" +
  "🔗 <b>Link:</b> <code>" + link + "</code>\n" +
  "💵 <b>Reward:</b> ₹" + rew.toFixed(2) + " per user\n" +
  "👥 <b>Completions:</b> <code>" + use + " / " + clm + " users</code>\n" +
  "📃 <b>Description:</b> " + des + "\n" +
  "ℹ️ <b>Status:</b> <b>" + bsLabel + "</b>\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •";

var inl = [
  [
    { text: bsLabel, callback_data: "/sttatt " + nam + "#-#-#" + bac },
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
    { text: "⬆️ Return", callback_data: "/alltask#123 " + bac }
  ]
];

Api.editMessageText({
  message_id: User.getProperty("adminid"),
  text: ttxt,
  parse_mode: "html",
  disable_web_page_preview: true,
  reply_markup: { inline_keyboard: inl }
});
