/*CMD
  command: /save_with_msg
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Admin Panel

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: save_with_msg
  group: 
CMD*/

if (!options) {
  return;
}

// 1. Extract sent message_id from Telegram API response
var msg_id = null;
if (options.result && options.result.message_id) {
  msg_id = options.result.message_id;
} else if (options.message_id) {
  msg_id = options.message_id;
}

if (!msg_id) {
  return;
}

// 2. Extract withdrawal ID (wid)
var wid = null;

// Method 1: from bb_options
if (options.bb_options && options.bb_options.wid) {
  wid = options.bb_options.wid;
}

// Method 2: from options directly
if (!wid && options.wid) {
  wid = options.wid;
}

// Method 3: extract from message text (contains "Request ID: #XXXXXX")
if (!wid && options.result && options.result.text) {
  var match = options.result.text.match(/Request ID:\s*#?(\d+)/i);
  if (match) {
    wid = match[1];
  }
}

// Method 4: from params if passed
if (!wid && params) {
  wid = params.trim();
}

// Method 5: from LastCreatedWithID fallback
if (!wid) {
  wid = Bot.getProperty("LastCreatedWithID");
}

if (wid) {
  Bot.setProperty("WithMsg_" + wid, msg_id, "integer");
  var wData = Bot.getProperty("With_" + wid);
  if (wData) {
    wData.msg_id = msg_id;
    Bot.setProperty("With_" + wid, wData, "json");
  }
}
