/*CMD
  command: /alltask#123
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

var sell = Bot.getProperty("TaskJsonList")

var txt = ""

var xxx = parseInt(params)
var pre = xxx - 1
var nex = xxx + 1

var yyy = xxx - 1
var zzz = xxx - 2
var inv = yyy + "5"
var inVex = parseInt(inv)
var inp = ""+zzz+ "9" 
var inPre = parseInt(inp)
if(inPre == "09"){
var inPre = parseInt(9)
}
var inNex = parseInt(xxx + "0")



var inlkey = [[]]
var codeIndex
inlkey[1] = []
inlkey[2] = []
inlkey[3] = []
inlkey[4] = []
//inlkey[5] = []

var loooo = "0"
var lolnext = parseInt(loooo)

var cod = ""
for (var index in sell){
  var b = sell[index].name
  var bi = Bot.getProperty("Task+"+sell[index].name)
  var no = parseInt(index) + 1
 /* lool.push({
    text: inlnum,
    callback_data: "/Sellbot " + bi.name
  })*/
  var bstatus = Bot.getProperty("Status?"+b)
  codeIndex = sell[index]
  if((index > inPre)&&(index < inNex)){
  txt+= "\n📕 "+no+". <b>"+bi.name+"</b> ➡️ "+bi.payment+" <b>₹</b>\n➡️ <b>"+bstatus+"</b> For Do\n"
  
    codeIndex = sell[index]
    if(index < inVex){
      var keyboardRow = 0
    }else if(index < inNex){
      var keyboardRow = 1
    }//else if(index < 15){
     // var keyboardRow = 2
    //}
    inlkey[keyboardRow].push({
      text: "» "+no+" «", 
      callback_data: "/totaltask "+bi.name+"#-#-#"+xxx+""
    })
   }
   if(index > inNex){    
     var lolnext = lolnext + 1
   }

}
if(lolnext != 0){
    var keyboardRow = keyboardRow + 1
    
    inlkey[keyboardRow].push({
      text: "◀️Previous",
      callback_data:"/alltask#123 "+pre+""
    })
    inlkey[keyboardRow].push({
      text: "Next▶️",
      callback_data:"/alltask#123 "+nex+""
    }) 
   /* inlkey[keyboardRow].push({
      text: "⬆️ Return",
      callback_data:"/mysell#123"
    }) */
}else{
var keyboardRow = keyboardRow + 1
    
    inlkey[keyboardRow].push({
      text: "◀️Previous",
      callback_data:"/alltask#123 "+pre+""
    }) 
}
var keyboardRow = keyboardRow + 1
    inlkey[keyboardRow].push({
      text: "⬆️ Return",
      callback_data:"/admin"
    }) 
var cod = "<b>💠 Total Tasks In Bot are</b> "+no+"\n"+txt

Api.editMessageText({
  message_id: request.message.message_id,
  text: cod , 
  parse_mode: "html",
  reply_markup: { inline_keyboard: inlkey}
})

