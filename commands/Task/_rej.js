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
var nam = bbi ? bbi.name : nae
var des = bbi ? bbi.des : ""
var clm = bbi ? bbi.claim : ""
var rew = bbi ? bbi.payment : ""
var id = bbi ? bbi.id : ""
var admin = bbi ? bbi.admin : ""

Bot.sendMessageToChatWithId(
  users,
  "ℹ️* Your Task " +
    nam +
    " was Rejected by the Creator.\n\n*_📖 May be because of one of these reasons -\n1. You Have Not Completed The Task Properly! \n2. Your Submitted Proof Is Not Clear / Good Quality.\n3. You Have Sent Fake / Invalid Task Proof (Screenshot or Video). \n\n_*📲 You may try again later by completing the task properly!*"
)
Bot.sendMessage("*Task Rejected*")

// 🗄 Log Rejection to Storage Channel if configured
var dbChan = Bot.getProperty("StorageChannelID");
if (dbChan) {
  try {
    Api.sendMessage({
      chat_id: dbChan,
      text: "❌ <b>#TASK_PROOF_REJECTED</b>\n━━━━━━━━━━━━━━━━━━\n🆔 <b>Task ID:</b> #" + id + "\n📌 <b>Task:</b> " + nam + "\n🧑‍💻 <b>Worker:</b> <code>" + users + "</code>\n👑 <b>Owner:</b> <code>" + admin + "</code>",
      parse_mode: "html"
    });
  } catch (e) {}
}
