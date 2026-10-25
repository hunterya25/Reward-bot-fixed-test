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

if (request && request.id) {
  try {
    Api.answerCallbackQuery({ callback_query_id: request.id });
  } catch (e) {}
}

var pp = params;
var bbi = Bot.getProperty("Task+" + pp);
if (!bbi) {
  var overMsg = "*😔 Task Has Ended Or Is Unavailable*";
  if (request && request.message && request.message.message_id) {
    try {
      Api.editMessageText({
        chat_id: chat.chatid,
        message_id: request.message.message_id,
        text: overMsg,
        parse_mode: "markdown"
      });
      return;
    } catch (e) {}
  }
  Bot.sendMessage(overMsg, { parse_mode: "Markdown" });
  return;
}

var name = bbi.name;
var rew = bbi.payment;
var id = bbi.id;
User.setProperty("task_admin", params);
User.setProperty("task_proof_media_list", [], "json");

var cm = Bot.getProperty(name + "" + user.telegramid + "" + rew + "" + id);
var stt = Bot.getProperty("Status?" + name);

if (cm == true) {
  var tt = "*✅ You Have Already Completed This Task* - " + name;
  if (request && request.message && request.message.message_id) {
    try {
      Api.editMessageText({
        chat_id: chat.chatid,
        message_id: request.message.message_id,
        text: tt,
        parse_mode: "markdown"
      });
      return;
    } catch (e) {}
  }
  Bot.sendMessage(tt, { parse_mode: "Markdown" });
  return;
}

if (stt == "On") {
  var tto =
    "*➡️ Please Send Proof (Screenshot or Video) Of The Task So The Owner Can Verify And Pay You.*\n\n_You can send screenshots, videos, or multiple items (up to 10 max)._";

  if (request && request.message && request.message.message_id) {
    try {
      Api.editMessageText({
        chat_id: chat.chatid,
        message_id: request.message.message_id,
        text: tto,
        parse_mode: "markdown",
        disable_web_page_preview: true
      });
    } catch (e) {
      Api.sendMessage({
        chat_id: chat.chatid,
        text: tto,
        parse_mode: "markdown",
        disable_web_page_preview: true
      });
    }
  } else {
    Api.sendMessage({
      chat_id: chat.chatid,
      text: tto,
      parse_mode: "markdown",
      disable_web_page_preview: true
    });
  }

  Bot.runCommand("/submit_ss2");
} else {
  var disabledMsg = "*🪀 You Can't Do This Task Due To Creator Has Disabled This Task*";
  if (request && request.message && request.message.message_id) {
    try {
      Api.editMessageText({
        chat_id: chat.chatid,
        message_id: request.message.message_id,
        text: disabledMsg,
        parse_mode: "markdown"
      });
      return;
    } catch (e) {}
  }
  Bot.sendMessage(disabledMsg, { parse_mode: "Markdown" });
}
