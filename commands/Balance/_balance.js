/*CMD
  command: /balance
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Balance

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 💰 balance
  group: 
CMD*/

let Balance = Libs.ResourcesLib.userRes("balance")
  .value()
  .toFixed(3)
let Available_For_Payout = Libs.ResourcesLib.userRes("Available_For_Payout")
  .value()
  .toFixed(3)

var inlkey = [
  [{ text: "" }, { text: "" }],
  [{ text: "" }]
]
var Text = `• ━━━━━━━━━━━━━━━━━ •
<b>🔸️ Aᴠᴀɪʟᴀʙʟᴇ Bᴀʟᴀɴᴄᴇ</>
<code>${Balance}</> RS

🔸️ <b>Aᴠᴀɪʟᴀʙʟᴇ Fᴏʀ Pᴀʏᴏᴜᴛ</>
<code>${Available_For_Payout}</> RS
• ━━━━━━━━━━━━━━━━━ •

<b>COMPLETE TASK AND INCREASE YOUR BALANCE.🚀💰</>
• ━━━━━━━━━━━━━━━━━ •`
Api.sendMessage({
  text: Text,
  parse_mode: "HTML",
  reply_markup: { keyboard: inlkey, resize_keyboard: true }
})
