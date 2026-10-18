/*CMD
  command: /editDes#423
  help: 
  need_reply: true
  auto_retry_time: 
  folder: My Task
  answer: 👨‍💻 *Send the Description of Task* [<botEdit>] 

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var b = User.getProperty("editDes")

var bbi = Bot.getProperty("Task+" + b)
var nam = bbi.name
var des = message
var clm = bbi.claim
var rew = bbi.payment
var id = bbi.id
var demo = bbi.demo
if (message.length > 4000) {
  Bot.sendMessage("⚠️ *Description is too long!* Telegram allows up to 4000 characters. Your text is " + message.length + " characters.");
  Bot.runCommand("/editDes#423");
  return;
}

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
    text: "✅ <b>" + b + "'s Description Changed</b>",
    parse_mode: "html"
  });

  if (user.telegramid == Bot.getProperty("adminID")) {
    Bot.runCommand("/sttatt " + b);
  } else {
    Bot.runCommand("/sttat " + b);
  }
} else return;

