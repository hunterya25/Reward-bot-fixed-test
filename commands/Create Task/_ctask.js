/*CMD
  command: /ctask
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Create Task

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 📋 create task
  group: 
CMD*/

var inl = [
  [{ title: "🤖 Telegram Bot & Channel", command: "/ccct tg" }],
  [{ title: "🔖 Other Site", command: "/ccct oth" }]
]
var tt = "🔥* Choose Your Task Categories*"
Bot.sendInlineKeyboard(inl, tt)

