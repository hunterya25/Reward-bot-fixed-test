/*CMD
  command: /ctask8
  help: 
  need_reply: true
  auto_retry_time: 
  folder: Create Task

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

if (message.includes("@")) {
  Bot.sendMessage("❌* Enter Username Without @*")
Bot.runCommand("/ctask8")
  return
}
User.setProperty("promo_link", message)
  Bot.runCommand("/ctask9")
