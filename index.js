const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options.js')
const token = '5662862549:AAFPKPmwdI3kQ8tslVcphv56ZRKmb_932ew'

const bot = new TelegramApi(token, {polling: true})

const chats = {}



const startGame = async (chatId) => {
  await bot.sendMessage(chatId,'Сейчас я загадаю цифру от 0 до 9, а ты должен её угадать');
  const randomNumber =  Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId,'Отгадывай', gameOptions);
}

const start = () => {

  bot.setMyCommands( [
    {command: '/start', description: 'Начальное приветствие'},
    {command: '/info', description: 'Получить информацию о пользователе'},
    {command: '/game', description: 'Хата крутится лавеха мутится'},
  ])
  
  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
  
    if (text === '/start') {
      await bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp');
      return bot.sendMessage(chatId,`Welcome to the TG bot`);
    }
    if (text === '/info') {
      return bot.sendMessage(chatId, `You name ${msg.from.first_name} ${msg.from.last_name} `);
    }
    if (text === '/game') {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId,'Я тебя не понимаю');
  })
  
  bot.on('callback_query',async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === '/again') {
      return startGame(chatId)
    }
    if (data === chats[chatId]) {
      return bot.sendMessage(chatId,`Gratz ${chats[chatId]}`,againOptions)
    } else {
      return bot.sendMessage(chatId,`Loser ${chats[chatId]}`,againOptions)
    }
  })

}

start()