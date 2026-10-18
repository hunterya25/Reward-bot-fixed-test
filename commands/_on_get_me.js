/*CMD
  command: /on_get_me
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: on_get_me
  group: 
CMD*/

if (options && options.result && options.result.username) {
  Bot.setProperty("bot_username", options.result.username, "string");
}
