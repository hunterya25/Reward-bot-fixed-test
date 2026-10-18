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

var reqChans = Bot.getProperty("RequiredChannels", ["@BotsByAntares"]);
if (!reqChans || reqChans.length === 0) {
  reqChans = ["@BotsByAntares"];
}

var listStr = "";
for (var i = 0; i < reqChans.length; i++) {
  listStr += (i + 1) + ". `" + reqChans[i] + "`\n";
}

var text = "📢 *Mandatory Force-Join Channel Manager*\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n\n" +
  "Users *MUST* join all channels listed here before using the bot. If they leave any of these channels in the future, their access is paused automatically until they rejoin!\n\n" +
  "📋 *Active Required Channels (" + reqChans.length + "):*\n" +
  listStr + "\n" +
  "• ━━━━━━━━━━━━━━━━━━━━ •\n" +
  "⚠️ _Important: Make sure @" + bot.name + " is added as an Administrator in each channel!_";

var inl = [
  [
    { text: "➕ Add Required Channel", callback_data: "/add_channel" },
    { text: "➖ Remove Channel", callback_data: "/rem_channel" }
  ],
  [
    { text: "◀ Back To Panel", callback_data: "/admin" }
  ]
];

if (mm) {
  Api.editMessageText({
    message_id: mm,
    text: text,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
} else {
  Bot.sendInlineKeyboard(inl, text);
}
