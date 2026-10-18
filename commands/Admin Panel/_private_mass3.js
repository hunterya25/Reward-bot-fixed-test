/*CMD
  command: /private_mass3
  help: 
  need_reply: true
  auto_retry_time: 
  folder: Admin Panel

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var adm = Bot.getProperty("adminID");
if (user.telegramid != adm) {
  Bot.sendMessage("⛔️ Access Denied!");
  return;
}

var targetID = User.getProperty("target_pm_id");
if (!targetID) {
  Bot.sendMessage("⚠️ *Target User ID not found!* Please start again from /mass_setting.");
  return;
}

var mm = User.getProperty("adminid");
var replyBtn = [[{ text: "📞 Reply to Support", callback_data: "/support" }]];

// Check if message is a photo
if (request.photo && request.photo.length > 0) {
  var photo = request.photo[request.photo.length - 1].file_id;
  var caption = "*📩 Direct Message from Bot Administrator:*\n\n" + (request.caption || "");
  Api.sendPhoto({
    chat_id: targetID,
    photo: photo,
    caption: caption,
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: replyBtn }
  });
} else {
  var txt = "*📩 Direct Message from Bot Administrator:*\n\n" + message;
  Api.sendMessage({
    chat_id: targetID,
    text: txt,
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: replyBtn }
  });
}

// Clear target property
User.setProperty("target_pm_id", null);

var confirmTxt = "✅ *Private Message Delivered Successfully!*\n\n👤 *Sent To:* `" + targetID + "`\n_The user has received your message with a direct support reply button._";
var inl = [[{ text: "◀ Back to Mass Settings", callback_data: "/mass_setting" }]];

if (mm) {
  Api.editMessageText({
    message_id: mm,
    text: confirmTxt,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
} else {
  Api.sendMessage({
    text: confirmTxt,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
}
