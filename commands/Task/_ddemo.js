/*CMD
  command: /ddemo
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

Api.deleteMessage({ message_id: request.message.message_id });

var bbi = Bot.getProperty("Task+" + params);
if (!bbi) {
  Bot.sendMessage("❌ *Task not found or has been completed!*", { parse_mode: "Markdown" });
  return;
}

var nam = bbi.name;
var demoList = Bot.getProperty("TaskDemo_" + params);

if (!demoList || !Array.isArray(demoList) || demoList.length == 0) {
  if (bbi.demoMedia && Array.isArray(bbi.demoMedia) && bbi.demoMedia.length > 0) {
    demoList = bbi.demoMedia;
  } else if (bbi.demo) {
    demoList = [{ type: "photo", file_id: bbi.demo }];
  } else {
    demoList = [];
  }
}

if (demoList.length == 0) {
  Bot.sendMessage("⚠️ *No demo media attached to this task.*", { parse_mode: "Markdown" });
  return;
}

var ttxt =
  "📷 *Always Complete Your Task As Shown In This Demo.*\n_If you do not complete it correctly, the task creator may reject your proof!_";

if (demoList.length == 1) {
  if (demoList[0].type == "video") {
    Api.sendVideo({
      video: demoList[0].file_id,
      caption: ttxt,
      parse_mode: "Markdown"
    });
  } else {
    Api.sendPhoto({
      photo: demoList[0].file_id,
      caption: ttxt,
      parse_mode: "Markdown"
    });
  }
} else {
  var mg = [];
  for (var i = 0; i < demoList.length && i < 10; i++) {
    var item = {
      type: demoList[i].type == "video" ? "video" : "photo",
      media: demoList[i].file_id
    };
    if (i == 0) {
      item.caption = "📷 *Task Demo (" + demoList.length + " media items)*\n\n" + ttxt;
      item.parse_mode = "Markdown";
    }
    mg.push(item);
  }
  Api.sendMediaGroup({ media: mg });
  Api.sendMessage({
    text: "ℹ️ *Follow all " + demoList.length + " demo steps above to complete the task.*",
    parse_mode: "Markdown"
  });
}
