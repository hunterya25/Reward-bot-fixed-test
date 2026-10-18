/*CMD
  command: /submit_ss2
  help: 
  need_reply: true
  auto_retry_time: 
  folder: Task

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var proofList = User.getProperty("task_proof_media_list", []);
if (!proofList || !Array.isArray(proofList)) {
  proofList = [];
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
  var txt = (message || "").toLowerCase().trim();
  if (txt == "done" || txt == "/done" || txt == "/send_proof" || txt == "submit") {
    if (proofList.length > 0) {
      Bot.runCommand("/send_proof");
      return;
    } else {
      Bot.sendMessage("❌ *Please send at least one screenshot or video as proof!*", { parse_mode: "Markdown" });
      Bot.runCommand("/submit_ss2");
      return;
    }
  }

  Bot.sendMessage("❌ *Please send a screenshot or video proof!*", { parse_mode: "Markdown" });
  Bot.runCommand("/submit_ss2");
  return;
}

proofList.push({ type: mType, file_id: fileId });
User.setProperty("task_proof_media_list", proofList, "json");

if (proofList.length >= 10) {
  Bot.sendMessage("✅ *Maximum 10 proof items reached! Submitting to owner...*", { parse_mode: "Markdown" });
  Bot.runCommand("/send_proof");
  return;
}

var buttons = [
  [
    { text: "🚀 Submit Proof (" + proofList.length + " media) ➔", callback_data: "/send_proof" }
  ]
];

Api.sendMessage({
  chat_id: chat.chatid,
  text: "✅ *Proof Media Added (" + proofList.length + "/10)*\n\n📸 _You can send another screenshot or video, or tap below to submit now._",
  parse_mode: "Markdown",
  reply_markup: { inline_keyboard: buttons }
});

Bot.runCommand("/submit_ss2");
