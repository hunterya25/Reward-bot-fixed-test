/*CMD
  command: /des
  help: 
  need_reply: false
  auto_retry_time: 
  folder: My Task

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var p = params

User.setProperty("editDes", p)
Bot.runCommand("/editDes#423")
