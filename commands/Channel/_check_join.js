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
if (reqChannels && reqChannels.length > 0) {
  reqChannels = reqChannels.filter(function(c) {
    return c && c.toString().trim().length > 1;
  });
}

if (!reqChannels || reqChannels.length === 0) {
  User.setProperty("channel_joined", true, "boolean");
  User.setProperty("checking_channel_idx", 0, "integer");
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

var channelIdx = params ? parseInt(params) : 0;
if (isNaN(channelIdx) || channelIdx < 0) {
  channelIdx = 0;
}

if (channelIdx >= reqChannels.length) {
  // All channels verified!
  User.setProperty("channel_joined", true, "boolean");
  User.setProperty("checking_channel_idx", 0, "integer");
  Bot.runCommand("/start");
  return;
}

User.setProperty("checking_channel_idx", channelIdx, "integer");
var targetChannel = reqChannels[channelIdx];

Api.getChatMember({
  chat_id: targetChannel,
  user_id: user.telegramid,
  on_result: "/on_check_join",
  on_error: "/on_check_join_error"
});
