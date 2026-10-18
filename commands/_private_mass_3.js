/*CMD
  command: /private_mass_3
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 

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

var targetID = User.getProperty("target_pm_id") || User.getProperty("targetUserID");

if (!targetID) {
  Bot.sendMessage("⚠️ User ID not found. Please start again from /mass_setting.");
  return;
}

var replyBtn = [[{ text: "📞 Reply to Support", callback_data: "/support" }]];

// ✅ Check if the message is a photo
if (request.photo && request.photo.length > 0) {
  var photo = request.photo[request.photo.length - 1].file_id;
  Api.sendPhoto({
    chat_id: targetID,
    photo: photo,
    caption: "*📩 Direct Message from Admin:*\n\n" + (request.caption || ""),
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: replyBtn }
  });
} else {
  // ✅ Send Text Message
  Api.sendMessage({
    chat_id: targetID,
    text: "*📩 Direct Message from Admin:*\n\n" + message,
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: replyBtn }
  });
}

// ✅ Confirm to Admin
Bot.sendMessage("✅ *Message sent successfully to* `" + targetID + "`!");
