/*CMD
  command: /user_setting
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

var mm = User.getProperty("adminid")
var adm = Bot.getProperty("adminID")
if (adm == user.telegramid) {
  var tto =
    "👋 *Welcome, Here You Can Manage Your Bot With a Single Options.*\n\n_🚷 Here are Some Options You Need To Set For This bot Else Bot Won't Work Properly._\n\n*🤖 Bot Name: @" +
    bot.name +
    "*\n\n_⚠ Warning When Using This Panel Please Don't Send Any Other Command  or it May Spoil Your Work !_"
  var inl = [
    [{ text: "👁 Check User Balance", callback_data: "/c_balance" }],
    [{ text: "🗣 Add / Remove Balance", callback_data: "/bc_balance" }],
    [
      { text: "🚯 Ban User", callback_data: "/ban" },
      { text: "✅ Unban User", callback_data: "/unban" }
    ],
    [
      { text: "📋 User History", callback_data: "/history" },
      { text: "✉️ Private Message", callback_data: "/private_mass" }
    ],
    [{ text: "◀ Back To Panel", callback_data: "/admin" }]
  ]
  Api.editMessageText({
    message_id: mm,
    text: tto,
    parse_mode: "markdown",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inl }
  })
  return
}

