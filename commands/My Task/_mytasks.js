/*CMD
  command: /mytasks
  help: 
  need_reply: false
  auto_retry_time: 
  folder: My Task

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 🏟 my tasks
  group: 
CMD*/

var tas = Bot.getProperty("Tasks" + user.telegramid);

if (!tas || tas.length === 0) {
  var txt = "👨‍💻 *You Have Not Created Any Tasks Yet!*\n\n_Use the Create Task button from the main menu to start earning or promoting._";
  Bot.sendMessage(txt, { parse_mode: "Markdown" });
  return;
}

for (var index in tas) {
  var b = tas[index];
  var bbi = Bot.getProperty("Task+" + b);
  if (!bbi) { continue; }

  var nam = bbi.name;
  var des = bbi.des || "No description";
  var clm = bbi.claim || 0;
  var rew = parseFloat(bbi.payment) || 0;
  var id = bbi.id;
  var link = bbi.link || "None";
  var bs = Bot.getProperty("Status?" + b, "On");
  var bsLabel = (bs == "On") ? "▶️ Active" : "⏸ Stopped";
  var use = Libs.ResourcesLib.anotherChatRes("total_claimed", id).value() || 0;

  var ttxt = "⚙️ <b>Manage Task: " + nam + "</b>\n" +
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
    ]
  ];

  Api.sendMessage({
    text: ttxt,
    parse_mode: "html",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
}
