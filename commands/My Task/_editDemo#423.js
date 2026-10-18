/*CMD
  command: /editDemo#423
  help: 
  need_reply: true
  auto_retry_time: 
  folder: My Task
  answer: 👨‍💻 *Send the Demo of Task (Screenshot or Video)*

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var b = User.getProperty("editDemo");
var bbi = Bot.getProperty("Task+" + b);

if (!bbi) {
  Bot.sendMessage("❌ *Task not found!*", { parse_mode: "Markdown" });
  return;
}

var admin = bbi.admin;
if (user.telegramid != admin && user.telegramid != Bot.getProperty("adminID")) {
  Bot.sendMessage("⛔️ *Permission Denied!*", { parse_mode: "Markdown" });
  return;
}

var fileId = null;
var mType = "photo";

if (request.photo && request.photo.length > 0) {
  fileId = request.photo[request.photo.length - 1].file_id;
  mType = "photo";
} else if (request.video) {
  fileId = request.video.file_id;
  mType = "video";
} else if (request.document) {
  fileId = request.document.file_id;
  var mime = request.document.mime_type || "";
  mType = mime.indexOf("video") >= 0 ? "video" : "photo";
} else if (request.animation) {
  fileId = request.animation.file_id;
  mType = "video";
}

if (!fileId) {
  Bot.sendMessage("❌ *Please send a valid screenshot or video as demo!*", { parse_mode: "Markdown" });
  Bot.runCommand("/editDemo#423");
  return;
}

var demoMedia = [{ type: mType, file_id: fileId }];

bbi.demo = fileId;
bbi.demoMedia = demoMedia;

Bot.setProperty("Task+" + b, bbi, "json");
Bot.setProperty("TaskDemo_" + b, demoMedia, "json");

// 🗄 Backup updated demo to Storage Channel if configured
var dbChan = Bot.getProperty("StorageChannelID");
if (dbChan) {
  var bTxt = "📁 <b>#TASK_DEMO_UPDATED</b>\n" +
    "━━━━━━━━━━━━━━━━━━\n" +
    "🆔 <b>Task ID:</b> #" + bbi.id + "\n" +
    "📌 <b>Title:</b> " + b + "\n" +
    "👤 <b>Updated By:</b> <code>" + user.telegramid + "</code>\n" +
    "📸 <i>New demo media attached</i>";

  try {
    if (mType == "video") {
      Api.sendVideo({ chat_id: dbChan, video: fileId, caption: bTxt, parse_mode: "html" });
    } else {
      Api.sendPhoto({ chat_id: dbChan, photo: fileId, caption: bTxt, parse_mode: "html" });
    }
  } catch (err) {
    // Ignore channel permission errors
  }
}

Api.sendMessage({
  text: "✅ <b>" + b + "'s Demo Successfully Updated!</b>",
  parse_mode: "html"
});

if (user.telegramid == Bot.getProperty("adminID")) {
  Bot.runCommand("/sttatt " + b);
} else {
  Bot.runCommand("/sttat " + b);
}
