/*CMD
  command: /reply2
  help: 
  need_reply: true
  auto_retry_time: 
  folder: Support
  answer: *Enter a Reply Message to Send to User*

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var admin = Bot.getProperty("adminID")
if(user.telegramid == admin){
var id = User.getProperty("reply?id")
Bot.sendInlineKeyboardToChatWithId(id,[{title:"↩️ Reply to Administrator", command:"📞 Support"}],"*🔍 Message From Administrator:*\n\n"+message+"")
Bot.sendMessage("*♨️ Message Sent To User!*")

}else{

return
}
