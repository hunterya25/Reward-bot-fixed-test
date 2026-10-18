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

if (request && request.id) {
  Api.answerCallbackQuery({
    callback_query_id: request.id,
    text: "🔍 Checking channel membership...",
    show_alert: false
  });
}

var channelIdx = (options && options.channelIdx) ? options.channelIdx : 0;
if (channelIdx >= reqChannels.length) {
  // All checked channels passed
  User.setProperty("channel_joined", true, "boolean");
  Bot.runCommand("/start");
  return;
}

var targetChannel = reqChannels[channelIdx];

Api.getChatMember({
  chat_id: targetChannel,
  user_id: user.telegramid,
  on_result: "/on_check_join",
  on_error: "/on_check_join_error",
  bb_options: { channelIdx: channelIdx, channel: targetChannel }
});
