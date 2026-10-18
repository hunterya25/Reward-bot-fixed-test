/*CMD
  command: /check_join
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

var reqChannels = Bot.getProperty("RequiredChannels", []);
if (!reqChannels || (reqChannels.length === 1 && reqChannels[0] === "@BotsByAntares")) {
  reqChannels = [];
} else if (reqChannels && reqChannels.length > 0) {
  reqChannels = reqChannels.filter(function(c) { return c && c !== "@BotsByAntares"; });
}
if (!reqChannels || reqChannels.length === 0) {
  User.setProperty("channel_joined", true, "boolean");
  Bot.runCommand("/start");
  return;
}

var targetChannel = reqChannels[0];

Api.getChatMember({
  chat_id: targetChannel,
  user_id: user.telegramid,
  on_result: "/on_check_join",
  on_error: "/on_check_join_error",
  bb_options: { channel: targetChannel }
});
