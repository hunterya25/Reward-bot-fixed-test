/*CMD
  command: /ctask2
  help: 
  need_reply: true
  auto_retry_time: 
  folder: Create Task
  answer: *➡️ Enter The Description Of The Task.*

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

User.setProperty("usertask3",message) 
Bot.runCommand("/ctask3") 
