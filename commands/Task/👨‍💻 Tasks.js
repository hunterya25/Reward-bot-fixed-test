/*CMD
  command: 👨‍💻 Tasks
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Task

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: /task, tasks, Tasks, /tasks
  group: 
CMD*/

var tasksGate = Bot.getProperty("TasksSection_status", "✅");
var adm = Bot.getProperty("adminID");

if (tasksGate == "❌" && user.telegramid != adm) {
  Bot.sendMessage("⛔️ *Tasks section is temporarily disabled by Administration.*\n\nPlease check back later or contact Support.");
  return;
}

var ag = User.getProperty("taskagree");
if (!ag) {
  var tto = "*👍 Read Our Agreement Then Click On Agree.*\n\n" +
    "_1️⃣ Please Do The Tasks Honestly And To The Best Of Your Ability.\n" +
    "2️⃣ Once A Task Has Been Broadcasted It Can't Be Cancelled.\n" +
    "3️⃣ Funds Deposited For Tasks Are Non Refundable.\n" +
    "4️⃣ All Task Buyers Are Responsible To Check Completed Work.\n" +
    "5️⃣ Tasks Are Auto Approved After 24 Hours._";

  Api.sendMessage({
    text: tto,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "👍 Agree", callback_data: "/agreeTask" }]
      ]
    }
  });
  return;
}

var codeList = Bot.getProperty("TaskJsonList");
if (!codeList || !Array.isArray(codeList) || codeList.length === 0) {
  Bot.sendMessage("*😔 No Tasks Available Right Now.*", { parse_mode: "Markdown" });
  return;
}

var tasksRendered = 0;

for (var index in codeList) {
  var name = codeList[index].name;
  if (!name) continue;

  var bbi = Bot.getProperty("Task+" + name);
  if (!bbi) continue;

  var stt = Bot.getProperty("Status?" + name, "On");
  if (stt != "On") continue;

  var nam = bbi.name || name;
  var des = bbi.des || "No description";
  var clm = bbi.claim || 0;
  var rew = bbi.payment || 0;
  var id = bbi.id;
  var cat = bbi.cat;
  var link = bbi.link || "";

  var line = link;
  if (cat == "tg") {
    line = "https://t.me/" + line.replace("@", "").trim();
  } else {
    if (!line.startsWith("http://") && !line.startsWith("https://") && !line.startsWith("tg://")) {
      line = "https://" + line;
    }
  }

  var use = Libs.ResourcesLib.anotherChatRes("total_claimed", id).value() || 0;
  var tol = clm - use;
  if (tol < 0) tol = 0;

  var ttxt =
    "<b>🆔 Task ID:</b> #" +
    id +
    "\n• ━━━━━━━━━━━━━━━━━ •\n" +
    "👁️ <b>Task Title:</b> " +
    nam +
    "\n<b>📃 Description:</b> <i>" +
    des +
    "</i>\n<b>💲 Reward:</b> " +
    rew +
    " <b>₹Rs</b>\n" +
    "👤 <b>Completions:</b> " +
    use +
    " / " +
    clm +
    "\n• ━━━━━━━━━━━━━━━━━ •\n" +
    "🕰 <b>Hurry Up! Only <code>" +
    tol +
    "</code> spots left!</b>";

  var inl = [
    [
      { text: "↗️ Visit Now", url: line },
      { text: "ℹ️ Submit Details", callback_data: "/submit_ss " + nam }
    ],
    [
      {
        text: "🌺 Task Demo",
        callback_data: "/ddemo " + nam
      }
    ]
  ];

  try {
    Api.sendMessage({
      text: ttxt,
      parse_mode: "html",
      disable_web_page_preview: true,
      reply_markup: { inline_keyboard: inl }
    });
    tasksRendered++;
  } catch (err) {
    Api.sendMessage({
      text: "🆔 Task ID: #" + id + "\nTitle: " + nam + "\nReward: ₹" + rew + "\nUsers: " + use + "/" + clm,
      reply_markup: { inline_keyboard: inl }
    });
    tasksRendered++;
  }
}

if (tasksRendered === 0) {
  Bot.sendMessage("*😔 No Active Tasks Available Right Now.*", { parse_mode: "Markdown" });
}
