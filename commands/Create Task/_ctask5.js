/*CMD
  command: /ctask5
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Create Task

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var claim = User.getProperty("usertask1")
var pp = User.getProperty("usertask4")
var des = User.getProperty("usertask3")
var ti = User.getProperty("usertask2")
var demo = User.getProperty("usertask5")
var cat = User.getProperty("category")
var link = User.getProperty("promo_link")
if (cat == "tg") {
  var lin = "@" + link
} else {
  var lin = link
}
var ad = user.telegramid
var tt = `*» Title:* ${ti}
*» Description:* ${des}
*» Payment:* ${pp} *₹Rs*
*» Users:* 0/${claim}
*» Link: ${lin}*`

var ranom = Libs.Random.randomInt(1, 9999999999)
var random = "NewTask" + ranom
var id = Libs.Random.randomInt(0, 9999999)
var comb =
  claim +
  "#-#-#" +
  ti +
  "#-#-#" +
  pp +
  "#-#-#" +
  des +
  "#-#-#" +
  ad +
  "#-#-#" +
  id +
  "#-#-#" +
  demo +
  "#-#-#" +
  cat +
  "#-#-#" +
  link

Bot.setProperty(random, comb)

var inl = [
  [
    { text: "✅ Confirm", callback_data: "/con " + random },
    { text: "❌ Cancel", callback_data: "/can" }
  ]
]

Api.sendPhoto({
  photo: demo,
  caption: tt,
  parse_mode: "Markdown",
  disable_web_page_preview: true,
  reply_markup: { inline_keyboard: inl }
})

