/*CMD
  command: /add_channel2
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

Api.deleteMessage({ chat_id: chat.chatid, message_id: request.message_id });
var adm = Bot.getProperty("adminID");
if (user.telegramid != adm) {
  Bot.sendMessage("⛔️ Access Denied!");
  return;
}

var chName = message.trim();
chName = chName.replace("https://t.me/", "").replace("http://t.me/", "").replace("t.me/", "").replace("/", "");
if (!chName.startsWith("@") && !chName.startsWith("-100")) {
  chName = "@" + chName;
}

if (chName.length < 3) {
  Bot.sendMessage("❌ *Invalid channel username!*");
  Bot.runCommand("/add_channel");
  return;
}

var reqChans = Bot.getProperty("RequiredChannels", []);
if (!reqChans) { reqChans = []; }

// filter out any lingering legacy @BotsByAntares if present
reqChans = reqChans.filter(function(c) { return c && c !== "@BotsByAntares"; });

if (reqChans.indexOf(chName) === -1) {
  reqChans.push(chName);
  Bot.setProperty("RequiredChannels", reqChans, "json");
  Bot.sendMessage("✅ *Channel `" + chName + "` has been added to Mandatory Channels!*");
} else {
  Bot.sendMessage("ℹ️ *Channel `" + chName + "` is already in the list.*");
}

Bot.runCommand("/chan_settings");
