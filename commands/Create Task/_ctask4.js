/*CMD
  command: /ctask4
  help: 
  need_reply: true
  auto_retry_time: 
  folder: Create Task
  answer: *📷 Send The Demo Of Your Task (Screenshot or Video)*\n\n_You can send screenshots, videos, or multiple items (up to 10 max)._

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var list = User.getProperty("task_demo_media_list", []);
if (!list || !Array.isArray(list)) {
  list = [];
}

var fileId = null;
var mType = null;

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
  var txt = (message || "").toLowerCase().trim();
  if (txt == "done" || txt == "/done" || txt == "/ctask5" || txt == "finish") {
    if (list.length > 0) {
      Bot.runCommand("/ctask5");
      return;
    } else {
      Bot.sendMessage("❌ *Please send at least one screenshot or video as demo!*", { parse_mode: "Markdown" });
      Bot.runCommand("/ctask4");
      return;
    }
  }

  Bot.sendMessage("❌ *Please send a screenshot or video demo!*", { parse_mode: "Markdown" });
  Bot.runCommand("/ctask4");
  return;
}

list.push({ type: mType, file_id: fileId });
User.setProperty("task_demo_media_list", list, "json");
User.setProperty("usertask5", list[0].file_id);

if (list.length >= 10) {
  Bot.sendMessage("✅ *Maximum 10 demo media reached! Generating preview...*", { parse_mode: "Markdown" });
  Bot.runCommand("/ctask5");
  return;
}

var buttons = [
  [
    { text: "✅ Done (" + list.length + " media) / Proceed ➔", callback_data: "/ctask5" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: "✅ *Demo Media Added (" + list.length + "/10)*\n\n📸 _You can send another screenshot/video, or tap below to proceed._",
  parse_mode: "Markdown",
  reply_markup: { inline_keyboard: buttons }
});

Bot.runCommand("/ctask4");
