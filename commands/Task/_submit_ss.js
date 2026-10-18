/*CMD
  command: /submit_ss
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

var pp = params;
var bbi = Bot.getProperty("Task+" + pp);
if (!bbi || bbi == undefined) {
  Api.editMessageText({
    message_id: request.message.message_id,
    text: "*😔 Task Has Been Over*",
    parse_mode: "markdown",
    disable_web_page_preview: true
  });
  return;
}
var name = bbi.name;
var rew = bbi.payment;
var id = bbi.id;
User.setProperty("task_admin", params);
User.setProperty("task_proof_media_list", [], "json");

var tto =
  "*➡️ Please Send Proof (Screenshot or Video) Of The Task So The Owner Can Verify And Pay You.*\n\n_You can send screenshots, videos, or multiple items (up to 10 max)._";

var cm = Bot.getProperty(name + "" + user.telegramid + "" + rew + "" + id);
var stt = Bot.getProperty("Status?" + name);
if (cm == true) {
  var tt = "*✅ You Have Already Completed This Task* - " + name;
  Api.editMessageText({
    message_id: request.message.message_id,
    text: tt,
    parse_mode: "markdown",
    disable_web_page_preview: true
  });
  return;
}
if (stt == "On") {
  Api.editMessageText({
    message_id: request.message.message_id,
    text: tto,
    parse_mode: "markdown",
    disable_web_page_preview: true
  });
  Bot.runCommand("/submit_ss2");
} else {
  Api.editMessageText({
    message_id: request.message.message_id,
    text:
      "*🪀 You Can't Do This Task Due To Creator Has Disabled This Task*",
    parse_mode: "markdown",
    disable_web_page_preview: true
  });
}
