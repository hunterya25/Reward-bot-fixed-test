/*CMD
  command: /ctask1
  help: 
  need_reply: true
  auto_retry_time: 
  folder: Create Task

  <<ANSWER
*➡️ Enter The Title Of The Task.*
_It Cannot Be More Than 15 Characters._
  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var codeList = Bot.getProperty("TaskJsonList")
for (var index in codeList) {
  var name = codeList[index].name

  var bbi = Bot.getProperty("Task+" + name)
  var nam = bbi.name
  if (nam == message) {
    Bot.sendMessage("*😔 Same Title Already Used In Bot*")
    Bot.runCommand("/ctask1")
    return
  }
}
var wa = message
if (wa.length < 20) {
  User.setProperty("usertask2", message)
  Bot.runCommand("/ctask2")
} else {
  Bot.sendMessage("😒* Title Cannot Be More Than 20 Characters. *")
  Bot.runCommand("/ctask1")
}

