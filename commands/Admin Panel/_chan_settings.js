/*CMD
  command: /chan_settings
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

if (adm != user.telegramid) {
  Bot.sendMessage("⛔️ Access Denied!");
  return;
}

var reqChans = Bot.getProperty("RequiredChannels", []);
if (!reqChans || (reqChans.length === 1 && reqChans[0] === "@BotsByAntares")) {
  reqChans = [];
  Bot.setProperty("RequiredChannels", [], "json");
}

var listStr = "";
if (reqChans.length === 0) {
  listStr = "ℹ️ _No mandatory channels configured._\n🟢 *Force-Join is currently OFF.* All users can access the bot freely.\n";
} else {
  for (var i = 0; i < reqChans.length; i++) {
    listStr += (i + 1) + ". `" + reqChans[i] + "`\n";
  }
}

var text = "📢 *Mandatory Force-Join Channel Manager*\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n\n" +
  "Users *MUST* join all channels listed here before using the bot. If they leave any of these channels in the future, their access is paused automatically until they rejoin!\n\n" +
  "📋 *Active Required Channels (" + reqChans.length + "):*\n" +
  listStr + "\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "⚠️ _Important: Make sure your bot is added as an Administrator in each channel!_";

var inl = [
  [
    { text: "➕ Add Required Channel", callback_data: "/add_channel" }
  ]
];

if (reqChans.length > 0) {
  inl[0].push({ text: "➖ Remove Channel", callback_data: "/rem_channel" });
  inl.push([{ text: "🗑 Clear All Channels", callback_data: "/rem_channel ALL" }]);
}

inl.push([{ text: "◀ Back To Panel", callback_data: "/admin" }]);

if (mm) {
  Api.editMessageText({
    message_id: mm,
    text: text,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
} else {
  Api.sendMessage({
    text: text,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
}
