/*CMD
  command: /save_with_msg
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

var wid = params ? params.trim() : "";
if (wid && request && request.message_id) {
  Bot.setProperty("WithMsg_" + wid, request.message_id, "integer");
}
