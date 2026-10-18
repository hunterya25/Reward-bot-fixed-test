/*CMD
  command: /do
  help: 
  need_reply: true
  auto_retry_time: 
  folder: 
  answer: SEND THE MESSAGE

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var user_chat = User.getProperty("target_user");

if(!user_chat){
  Bot.sendMessage("❌ No user selected! Use /select_user [UserID] first.");
  return;
}

var txt = "*📩 Message from Admin:*\n\n" + message;

// 🔹 यूज़र को मैसेज भेजो
Bot.sendMessageToChatWithId(user_chat, txt, { parse_mode: "Markdown" });

// 🔹 Confirmation मैसेज एडमिन को दिखाओ
Bot.sendMessage("✅ *Message sent successfully!*");
