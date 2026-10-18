/*CMD
  command: /con
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Task

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

Api.deleteMessage({ message_id: request.message.message_id })
var oke = Bot.getProperty(params)
let idia = oke.split("#-#-#")

var json4 = {
  claim: idia[0],
  name: idia[1],
  payment: idia[2],
  des: idia[3],
  admin: idia[4],
  id: idia[5],
  demo: idia[6],
  cat: idia[7],
  link: idia[8]
}
var a1 = idia[4]
var a2 = idia[1]
var bb = idia[0] * idia[2]
/////////////////-------
var task = Libs.ResourcesLib.anotherChatRes("total_task", "global")
task.add(1)
var ary = Bot.getProperty("TaskJsonList")
var arr = ary ? ary : []
var okjs = {
  name: a2
}
arr.push(okjs)
Bot.setProperty("TaskJsonList", arr, "json")

var times = Libs.ResourcesLib.anotherChatRes("TiMeS", "global")
times.add(1)

Bot.setProperty("Name" + times.value(), a2, "string")
Bot.setProperty("Task+" + a2, json4, "json")

var bost = Libs.ResourcesLib.anotherChatRes("TotalAddedTasks", a1)

bost.add(1)
let balance = Libs.ResourcesLib.userRes("balance")
balance.add(-bb)
Bot.setProperty("Status?" + a2, "On")
var ary = Bot.getProperty("Tasks" + a1)
var arr = ary ? ary : []
arr.push(a2)
Bot.setProperty("Tasks" + a1, arr, "json")
Bot.sendMessage(
  "*✅ Your Task Has Been Published.*\n_ In The Task List, Wait For Members To Carry Out Your Activity And Offer Earnings For Completing It Correctly._"
)
var fullBotUsers = Bot.getProperty("wholeUsers")
for (var index in fullBotUsers) {
  var info = fullBotUsers[index]
  var nn = Bot.getProperty("taskalert" + info, "🔔")
  if (nn == "🔔") {
    Api.sendMessage({
      chat_id: info,
      text:
        "*✅ New task available #" +
        idia[5] +
        "\n\n🔔 You can disable this notification in settings.*",
      parse_mode: "Markdown"
    })
    //   return
  }
}

