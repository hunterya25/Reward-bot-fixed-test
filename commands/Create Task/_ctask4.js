/*CMD
  command: /ctask4
  help: 
  need_reply: true
  auto_retry_time: 
  folder: Create Task
  answer: *📷 Send The Demo Of Your Task*

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

if (request.photo) {
  User.setProperty("usertask5", request.photo[0].file_id)
  Bot.runCommand("/ctask5")
  return
}

