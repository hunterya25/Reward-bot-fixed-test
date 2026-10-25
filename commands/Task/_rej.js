/*CMD
  command: /rej
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Task

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

if (request && request.message && request.message.message_id) {
  try {
    Api.deleteMessage({ message_id: request.message.message_id });
  } catch (e) {}
}

var users, nae;
if (params.indexOf("###") >= 0) {
  var splt = params.split("###");
  users = splt[0];
  nae = splt[1];
} else {
  var firstDash = params.indexOf("-");
  if (firstDash >= 0) {
    users = params.substring(0, firstDash);
    nae = params.substring(firstDash + 1);
  } else {
    users = params;
    nae = "";
  }
}

var bbi = Bot.getProperty("Task+" + nae);
var nam = bbi ? bbi.name : nae;
var des = bbi ? bbi.des : "";
var clm = bbi ? bbi.claim : "";
var rew = bbi ? bbi.payment : "";
var id = bbi ? bbi.id : "";
var admin = bbi ? bbi.admin : "";

// Clear any completion property so the user can try again!
if (id) {
  Bot.setProperty(nam + "" + users + "" + rew + "" + id, null);
}

// Send clear notification to the worker with a 1-tap "Try Again" button
var rejectMsg = "❌ <b>Task Proof Rejected</b>\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "📌 <b>Task:</b> " + nam + "\n" +
  "💰 <b>Reward:</b> ₹" + rew + " Rs\n\n" +
  "📖 <b>Possible reasons from creator:</b>\n" +
  "1. Task was not completed according to the demo / instructions.\n" +
  "2. Screenshot or video proof was unclear, invalid, or fake.\n\n" +
  "🔄 <b>Don't worry! You can try again right now:</b>\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •";

var tryAgainBtn = [
  [
    { text: "🔄 Try Again / Resubmit Proof", callback_data: "/submit_ss " + nam }
  ]
];

try {
  Api.sendMessage({
    chat_id: users,
    text: rejectMsg,
    parse_mode: "html",
    reply_markup: { inline_keyboard: tryAgainBtn }
  });
} catch (e) {
  // Fallback direct message
  Bot.sendMessageToChatWithId(users, "❌ Your proof for task " + nam + " was rejected. You can try again!");
}

Bot.sendMessage("❌ *Task Proof Rejected! The user has been notified and given the option to re-try.*", { parse_mode: "Markdown" });

// 🗄 Log Rejection to Storage Channel if configured
var dbChan = Bot.getProperty("StorageChannelID");
if (dbChan) {
  try {
    Api.sendMessage({
      chat_id: dbChan,
      text: "❌ <b>#TASK_PROOF_REJECTED</b>\n━━━━━━━━━━━━━━━━━━\n🆔 <b>Task ID:</b> #" + id + "\n📌 <b>Task:</b> " + nam + "\n🧑‍💻 <b>Worker:</b> <code>" + users + "</code>\n👑 <b>Owner:</b> <code>" + admin + "</code>",
      parse_mode: "html"
    });
  } catch (e) {}
}
