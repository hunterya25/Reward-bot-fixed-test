/*CMD
  command: /on_check_join_error
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Channel

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var adm = Bot.getProperty("adminID");
var errDesc = (options && options.error && options.error.description) ? options.error.description : "Unknown Telegram Error";

var curIdx = User.getProperty("checking_channel_idx", 0);
if (isNaN(curIdx)) { curIdx = 0; }
var reqChannels = Bot.getProperty("RequiredChannels", []);
var targetChan = (reqChannels && reqChannels[curIdx]) ? reqChannels[curIdx] : "required channel";

if (adm) {
  Api.sendMessage({
    chat_id: adm,
    text: "⚠️ <b>Channel Verification Alert:</b>\n" +
      "Telegram returned an error while checking membership for <b>" + targetChan + "</b>:\n" +
      "<code>" + errDesc + "</code>\n\n" +
      "<i>Make sure your bot is an Administrator in " + targetChan + " with permission to view members!</i>",
    parse_mode: "html"
  });
}

// Show friendly notice to user with retry button
var chanListText = "";
var inl = [];
if (reqChannels && reqChannels.length > 0) {
  for (var i = 0; i < reqChannels.length; i++) {
    var ch = reqChannels[i];
    var chClean = ch.replace("@", "").trim();
    chanListText += "👉 <a href='https://t.me/" + chClean + "'>" + ch + "</a>\n";
    inl.push([{ text: "📢 Join " + ch, url: "https://t.me/" + chClean }]);
  }
}
inl.push([{ text: "✅ Try Verify Again", callback_data: "/check_join" }]);

var userMsg = "⚠️ <b>Verification Issue:</b>\n\n" +
  "Unable to verify your membership in <b>" + targetChan + "</b>.\n\n" +
  "👉 <i>Possible reasons:</i>\n" +
  "1. You haven't joined the channel yet.\n" +
  "2. The bot is not an Administrator in the channel yet.\n\n" +
  "Please make sure you have joined and tap <b>Try Verify Again</b> below:";

if (request && request.message && request.message.message_id) {
  Api.editMessageText({
    message_id: request.message.message_id,
    text: userMsg,
    parse_mode: "html",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
} else {
  Api.sendMessage({
    text: userMsg,
    parse_mode: "html",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
}
