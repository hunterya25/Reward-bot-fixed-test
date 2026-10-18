/*CMD
  command: settingm
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Setting

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

let msg_id = options.result.message_id
User.setProperty("settingm", msg_id, "integer")

