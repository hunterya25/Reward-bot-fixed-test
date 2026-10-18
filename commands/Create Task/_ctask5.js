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

var claim = User.getProperty("usertask1");
var pp = User.getProperty("usertask4");
var des = User.getProperty("usertask3");
var ti = User.getProperty("usertask2");
var cat = User.getProperty("category");
var link = User.getProperty("promo_link");

var demoList = User.getProperty("task_demo_media_list", []);
if (!demoList || !Array.isArray(demoList) || demoList.length == 0) {
  var oldDemo = User.getProperty("usertask5");
  if (oldDemo) {
    demoList = [{ type: "photo", file_id: oldDemo }];
  } else {
    demoList = [];
  }
}

var demo = demoList.length > 0 ? demoList[0].file_id : "";
var lin = cat == "tg" ? "@" + link : link;
var ad = user.telegramid;

var tt = "*» Title:* " + ti + "\n" +
  "*» Description:* " + des + "\n" +
  "*» Payment:* " + pp + " *₹Rs*\n" +
  "*» Users:* 0/" + claim + "\n" +
  "*» Link:* " + lin + "\n" +
  "*» Demo Media:* " + demoList.length + " item(s)";

var ranom = Libs.Random.randomInt(1, 9999999999);
var random = "NewTask" + ranom;
var id = Libs.Random.randomInt(0, 9999999);
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
  link;

Bot.setProperty(random, comb);
Bot.setProperty(random + "_demoList", demoList, "json");

var inl = [
  [
    { text: "✅ Confirm", callback_data: "/con " + random },
    { text: "❌ Cancel", callback_data: "/can" }
  ]
];

if (demoList.length == 1) {
  if (demoList[0].type == "video") {
    Api.sendVideo({
      video: demoList[0].file_id,
      caption: tt,
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      reply_markup: { inline_keyboard: inl }
    });
  } else {
    Api.sendPhoto({
      photo: demoList[0].file_id,
      caption: tt,
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      reply_markup: { inline_keyboard: inl }
    });
  }
} else if (demoList.length > 1) {
  var mg = [];
  for (var m = 0; m < demoList.length && m < 10; m++) {
    var itm = {
      type: demoList[m].type == "video" ? "video" : "photo",
      media: demoList[m].file_id
    };
    if (m == 0) {
      itm.caption = tt;
      itm.parse_mode = "Markdown";
    }
    mg.push(itm);
  }
  Api.sendMediaGroup({
    media: mg
  });
  Api.sendMessage({
    text: "⬆️ *Review all " + demoList.length + " demo media above.* Click Confirm to publish your task:",
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: inl }
  });
} else {
  Api.sendMessage({
    text: tt,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  });
}
