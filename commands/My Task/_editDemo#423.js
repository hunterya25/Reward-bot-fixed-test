/*CMD
  command: /editDemo#423
  help: 
  need_reply: true
  auto_retry_time: 
  folder: My Task
  answer: 👨‍💻 *Send the Demo of Task* 

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var b = User.getProperty("editDemo")

var bbi = Bot.getProperty("Task+" + b)
var nam = bbi.name
var des = bbi.des
var clm = bbi.claim
var rew = bbi.payment
var id = bbi.id
var demo = request.photo[0].file_id
var admin = bbi.admin
if (user.telegramid == admin || user.telegramid == Bot.getProperty("adminID")) {
  var jjson = {
    claim: clm,
    name: nam,
    payment: rew,
    des: des,
    admin: admin,
    id: id,
    demo: demo,
    cat: bbi.cat,
    link: bbi.link
  }

  Bot.setProperty("Task+" + b, jjson, "json")

  Api.sendMessage({
    text: "✅ <b>" + b + "'s Demo Changed</>",
    parse_mode: "html"
  })
} else return

