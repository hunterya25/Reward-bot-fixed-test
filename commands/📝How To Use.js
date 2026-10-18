/*CMD
  command: 📝How To Use
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

var button = [ 
  [
    { text: "🎞️ Watch Video Tutorial", callback_data: "/watch_tutorial" }
  ],
  [
    { text: "🔙 Back to Home Menu", callback_data: "/start" }
  ]
];

Api.sendMessage({
  text: "<b>📌 How to Use Task & Earn Bot?</b>\n\n" +
        "✅ <b>1. Complete Tasks:</b> Click on 'Tasks' and finish simple tasks to earn money.\n\n" +
        "👥 <b>2. Create Own Task:</b> Deposit And Create Your Own Task And Promote Anything.\n\n" +
        "💰 <b>3. Withdraw Money:</b> Once you reach ₹1, withdraw your earnings via UPI.\n\n" +
        "🎥 <b>Watch the tutorial below for more details:</b>",
  reply_markup: JSON.stringify({ inline_keyboard: button }),
  parse_mode: "html"
});

