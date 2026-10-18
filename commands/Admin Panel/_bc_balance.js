/*CMD
  command: /bc_balance
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Admin Panel

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var adm = Bot.getProperty("adminID");
if (user.telegramid != adm) {
  Bot.sendMessage("⛔️ Access Denied!");
  return;
}

Api.editMessageText({
  message_id: User.getProperty("adminid"),
  text: "*🆔 Adjust User Balance*\n\nSend in this format:\n`telegramid-amount`\n\nExamples:\n• `12345678-100` (Credits ₹100 Deposit Balance)\n• `12345678--50` (Deducts ₹50 from Balance)\n• `12345678-50-pay` (Credits ₹50 to Payout Wallet)",
  parse_mode: "markdown",
  disable_web_page_preview: true,
  reply_markup: {
    inline_keyboard: [[{ text: "◀ Back", callback_data: "/user_setting" }]]
  }
})
Bot.runCommand("/bc_balance2") 
