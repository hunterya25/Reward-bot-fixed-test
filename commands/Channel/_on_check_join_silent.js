/*CMD
  command: /on_check_join_silent
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

if (!options || !options.result) {
  return;
}

var memberStatus = options.result.status;
var isJoined = (memberStatus === "member" || memberStatus === "administrator" || memberStatus === "creator" || memberStatus === "restricted");

if (isJoined) {
  User.setProperty("channel_joined", true, "boolean");
  User.setProperty("last_channel_check", new Date().getTime(), "integer");
} else {
  // User left the channel! Mark as not joined so next action blocks them
  User.setProperty("channel_joined", false, "boolean");
}
