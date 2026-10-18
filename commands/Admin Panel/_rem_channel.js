/*CMD
  command: /rem_channel
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Admin Panel

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var mm = User.getProperty("adminid");
var adm = Bot.getProperty("adminID");
if (user.telegramid != adm) {
  Bot.sendMessage("⛔️ Access Denied!");
  return;
}

var reqChans = Bot.getProperty("RequiredChannels", []);
if (!reqChans) { reqChans = []; }

var prm = params ? params.trim() : "";
if (prm) {
  if (prm === "ALL") {
    Bot.setProperty("RequiredChannels", [], "json");
    Bot.sendMessage("🗑 *All mandatory channels have been cleared! Force-Join is now OFF.*");
    Bot.runCommand("/chan_settings");
    return;
  }

  var newChans = [];
  for (var i = 0; i < reqChans.length; i++) {
    if (reqChans[i] !== prm) {
      newChans.push(reqChans[i]);
    }
  }
  Bot.setProperty("RequiredChannels", newChans, "json");
  Bot.sendMessage("🗑 *Channel `" + prm + "` removed from required channels!*");
  Bot.runCommand("/chan_settings");
  return;
}

if (reqChans.length === 0) {
  Bot.sendMessage("ℹ️ *No channels configured to remove.*");
  Bot.runCommand("/chan_settings");
  return;
}

var text = "➖ *Select Channel To Remove:*\n\n_Click on any channel below to remove it from the mandatory list:_";
var inl = [];

for (var k = 0; k < reqChans.length; k++) {
  inl.push([{ text: "🗑 Remove " + reqChans[k], callback_data: "/rem_channel " + reqChans[k] }]);
}
inl.push([{ text: "🗑 Clear All Channels", callback_data: "/rem_channel ALL" }]);
inl.push([{ text: "◀ Back", callback_data: "/chan_settings" }]);

if (mm) {
  Api.editMessageText({
    message_id: mm,
    text: text,
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: inl }
  });
} else {
  Bot.sendInlineKeyboard(inl, text);
}
