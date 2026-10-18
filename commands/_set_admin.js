/*CMD
  command: /set_admin
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

var existingAdmin = Bot.getProperty("adminID")
var adminChat = Bot.getProperty("admin_chat")

if (existingAdmin && user.telegramid != existingAdmin && user.telegramid != adminChat) {
  Bot.sendMessage("⛔️ *Access Denied!* An Admin ID is already configured. Only the current Admin can change this setting.")
  return
}

var newAdminId = params ? params.trim() : user.telegramid.toString()
Bot.setProperty("adminID", newAdminId, "string")
Bot.setProperty("admin_chat", newAdminId, "string")
Bot.sendMessage("✅ *Admin ID Configured Successfully!*\n\n👑 *Admin Telegram ID:* `" + newAdminId + "`\n\nYou can now run `/admin` to open the Management Panel.")

