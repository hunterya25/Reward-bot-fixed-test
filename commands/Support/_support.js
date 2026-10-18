/*CMD
  command: /support
  help: 
  need_reply: true
  auto_retry_time: 
  folder: Support
  answer: ❗* Enter Some Message to Send Administrative*

  <<KEYBOARD

  KEYBOARD
  aliases: 📞 support
  group: 
CMD*/

var admin_chat = Bot.getProperty("admin_chat");

if (!admin_chat) {
  Bot.sendMessage("Sorry. Bot has no admin configured right now.");
  User.setProperty("in_support", false, "boolean");
  return;
}

var user_link = Libs.commonLib.getLinkFor(user);
var txt = "*📣 New Support Message Came From User* " + user_link + "\n\n" + message;

Bot.sendInlineKeyboardToChatWithId(
  admin_chat,
  [{ title: "↩️ Reply to " + (user.first_name || "User"), command: "/reply " + user.telegramid }],
  txt
);

Api.forwardMessage({
  chat_id: admin_chat,
  from_chat_id: user.telegramid,
  message_id: request.message_id
});

User.setProperty("in_support", false, "boolean");
Bot.sendMessage("*✅ Message was sent successfully! You will get your reply shortly.*", { parse_mode: "Markdown" });
