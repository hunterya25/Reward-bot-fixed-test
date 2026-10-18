/*CMD
  command: /on_check_join_error
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Channel

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

// If bot cannot verify due to channel permission (bot must be admin in channel), notify admin
var adm = Bot.getProperty("adminID");
var errDesc = options && options.error ? options.error.description : "Unknown error";

if (adm) {
  Bot.sendMessageToChatWithId(adm, "⚠️ *Channel Verification Alert:*\nTelegram returned error while checking channel member: `" + errDesc + "`\n_Make sure your bot is an Administrator in @BotsByAntares with 'Add Members' right!_", { parse_mode: "Markdown" });
}

// Allow user to proceed or prompt retry
Bot.sendMessage("ℹ️ Please make sure you have joined https://t.me/BotsByAntares and try clicking Verify again in a few moments!");
