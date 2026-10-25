/*CMD
  command: /send_proof
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

if (request && request.id) {
  try {
    Api.answerCallbackQuery({
      callback_query_id: request.id,
      text: "✅ Proof submitted successfully!",
      show_alert: false
    });
  } catch (e) {}
}

var pi = User.getProperty("task_admin");
var bbi = Bot.getProperty("Task+" + pi);

if (!bbi) {
  Bot.sendMessage("❌ *Task has ended or is unavailable!*", { parse_mode: "Markdown" });
  return;
}

var proofList = User.getProperty("task_proof_media_list", []);
if (!proofList || !Array.isArray(proofList) || proofList.length == 0) {
  Bot.sendMessage("❌ *No proof media found. Please re-submit your proof!*", { parse_mode: "Markdown" });
  return;
}

var nam = bbi.name;
var des = bbi.des;
var clm = bbi.claim;
var rew = bbi.payment;
var id = bbi.id;
var admin = bbi.admin;

var usernamei = user.username
  ? "@" + user.username
  : "<a href='tg://user?id=" + user.telegramid + "'>" + (user.first_name || "User") + "</a>";

var txt =
  "<b>💛 New User Has Submitted Task Proof\n• ━━━━━━━━━━━━━━━━━ •\n🧑‍💻 User:</b> " +
  usernamei +
  "\n\n<b>🆔 Task ID:</b> #" +
  id +
  "\n👁️<b> Task Title:</b> " +
  nam +
  "\n<b>📃 Description:</b> " +
  des +
  "\n<b>💲 Reward:</b> " +
  rew +
  " <b>₹Rs</b>\n" +
  "📁 <b>Proof Media:</b> " + proofList.length + " item(s)";

var button = [
  [
    {
      text: "✅ Approved",
      callback_data: "/app " + user.telegramid + "###" + nam + "###" + rew
    },
    {
      text: "❌ Reject",
      callback_data: "/rej " + user.telegramid + "###" + nam
    }
  ]
];

// Send to Task Owner
if (proofList.length == 1) {
  if (proofList[0].type == "video") {
    Api.sendVideo({
      chat_id: admin,
      video: proofList[0].file_id,
      caption: txt,
      parse_mode: "html",
      reply_markup: { inline_keyboard: button }
    });
  } else {
    Api.sendPhoto({
      chat_id: admin,
      photo: proofList[0].file_id,
      caption: txt,
      parse_mode: "html",
      reply_markup: { inline_keyboard: button }
    });
  }
} else if (proofList.length > 1) {
  var mg = [];
  for (var m = 0; m < proofList.length && m < 10; m++) {
    var itm = {
      type: proofList[m].type == "video" ? "video" : "photo",
      media: proofList[m].file_id
    };
    if (m == 0) {
      itm.caption = "📁 <b>Proof Media (" + proofList.length + " items) from " + usernamei + "</b> for Task: " + nam + " (#" + id + ")";
      itm.parse_mode = "html";
    }
    mg.push(itm);
  }
  Api.sendMediaGroup({
    chat_id: admin,
    media: mg
  });
  Api.sendMessage({
    chat_id: admin,
    text: txt,
    parse_mode: "html",
    reply_markup: { inline_keyboard: button }
  });
}

// 🗄 Backup Proof Submission to Storage Channel if configured
var dbChan = Bot.getProperty("StorageChannelID");
if (dbChan) {
  var dbTxt = "📁 <b>#TASK_PROOF_SUBMISSION</b>\n" +
    "━━━━━━━━━━━━━━━━━━\n" +
    "🆔 <b>Task ID:</b> #" + id + "\n" +
    "📌 <b>Task:</b> " + nam + "\n" +
    "🧑‍💻 <b>Worker:</b> " + usernamei + " (<code>" + user.telegramid + "</code>)\n" +
    "👑 <b>Task Owner:</b> <code>" + admin + "</code>\n" +
    "💰 <b>Reward:</b> ₹" + rew + "\n" +
    "━━━━━━━━━━━━━━━━━━\n" +
    "📸 <i>Attached Proof: " + proofList.length + " item(s)</i>";

  try {
    if (proofList.length == 1) {
      if (proofList[0].type == "video") {
        Api.sendVideo({ chat_id: dbChan, video: proofList[0].file_id, caption: dbTxt, parse_mode: "html" });
      } else {
        Api.sendPhoto({ chat_id: dbChan, photo: proofList[0].file_id, caption: dbTxt, parse_mode: "html" });
      }
    } else if (proofList.length > 1) {
      var dbMg = [];
      for (var d = 0; d < proofList.length && d < 10; d++) {
        var dItm = {
          type: proofList[d].type == "video" ? "video" : "photo",
          media: proofList[d].file_id
        };
        if (d == 0) {
          dItm.caption = dbTxt;
          dItm.parse_mode = "html";
        }
        dbMg.push(dItm);
      }
      Api.sendMediaGroup({ chat_id: dbChan, media: dbMg });
    }
  } catch (err) {
    // Ignore channel permission errors
  }
}

// Update the inline message to show submitted state
if (request && request.message && request.message.message_id) {
  try {
    Api.editMessageText({
      chat_id: chat.chatid,
      message_id: request.message.message_id,
      text: "✅ <b>Proof Submitted Successfully!</b>\n\nYour proof (" + proofList.length + " item(s)) has been sent to the task owner for verification.",
      parse_mode: "html"
    });
  } catch (e) {}
}

// Send detailed confirmation message to the worker
var confirmMsg = "🎉 <b>Proof Submitted Successfully!</b> 🚀\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "📌 <b>Task:</b> " + nam + "\n" +
  "💰 <b>Reward:</b> ₹" + rew + " Rs\n" +
  "📸 <b>Proofs Attached:</b> " + proofList.length + " media item(s)\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n\n" +
  "⏳ <i>The task owner has received your proof. Once approved, the reward will be credited directly to your balance automatically!</i>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: confirmMsg,
  parse_mode: "html"
});

User.setProperty("task_proof_media_list", [], "json");
