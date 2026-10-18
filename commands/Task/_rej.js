/*CMD
  command: /rej
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
var splt = params.split("-")
var users = splt[0]
var nae = splt[1]
var bbi = Bot.getProperty("Task+" + nae)
var nam = bbi.name
var des = bbi.des
var clm = bbi.claim
var rew = bbi.payment
var id = bbi.id
var admin = bbi.admin
Bot.sendMessageToChatWithId(
  users,
  "ℹ️* Your Task " +
    nam +
    " is Rejected by the Creator.\n\n*_📖 May be because of one of these reasons -\n1. You Have Not Done Completed Task! \n2. Your Demo Task Is Not Good Quality.\n3. You Have Sended Fake & Crop Task Screenshot. \n\n_*📲 You would try later by improving your Task!*"
)
Bot.sendMessage("*Task Rejected*")

