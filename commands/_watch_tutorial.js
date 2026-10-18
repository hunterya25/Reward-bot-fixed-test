/*CMD
  command: /watch_tutorial
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

if (request.data) {
  var message_id = request.message.message_id;
  var chat_id = request.message.chat.id;

  Api.deleteMessage({
    chat_id: chat_id,
    message_id: message_id
  });
}

var but = [
  [{ text: "ʙᴀᴄᴋ ᴛᴏ ᴘʀᴇᴠɪᴏᴜs​ ᴍᴇɴᴜ", callback_data: "📝How To Use" }]
];

var video = "https://t.me/test381ns/4";
Api.sendVideo({
  video: video,
  caption: "*ᴡᴀᴛᴄʜ ɪᴛ* 👆👆",
  parse_mode: "MarkdownV2",
  reply_markup: JSON.stringify({ inline_keyboard: but })
});

