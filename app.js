import http from 'http'
import { Telegraf, Markup } from 'telegraf'

const bot = new Telegraf(process.env.ICH_TG_TOKEN)
const prize = 100
const wellcomText = `Получите инвайт абсолютно бесплатно
Так же вы можете приобрести инвайт без очереди и в течение пары минут быть в ClubHouse`
const payLink = process.env.PAY_LINK
const payText1 = `Что бы получить инвайт без очереди оплатите по ссылке ${prize} руб`
const payText2 = `В поле комментарий укажите ваш НОМЕР
В течении 5 - 10 минут вы получите ваш инвайт`
const referText = `Или можете получить инвайт бесплатно пригласив 25 друзей в бот`

bot.hears(['/start', '🚫 Отмена'], ctx => {
  ctx.replyWithVideo({source: './public/hi.mp4'}, {
    caption: wellcomText,
    ...Markup.keyboard(['Получить инвайт 🏷']).resize()
  })
})

bot.hears('Получить инвайт 🏷', ctx => {
  ctx.replyWithPhoto({source: './public/buy.jpg'}, {
    caption: 'Отправте свой номер на который зарегистрирован Clubhouse',
    ...Markup.keyboard([Markup.button.contactRequest('Отправить номер 📞'), '🚫 Отмена']).resize()
  })
})

bot.action('getfree', ctx => {
  ctx.replyWithPhoto({ source: './public/refer.jpg' }, {
    caption: referText,
    ...Markup.keyboard(['🚫 Отмена']).resize()
  })
})

bot.on('contact', async ctx => {
  await ctx.reply(payText1, Markup.keyboard(['🚫 Отмена']).resize())

  await ctx.reply(payText2, 
    Markup.inlineKeyboard([
      [Markup.button.url('Оплатить 💵', payLink)],
      [Markup.button.callback('Получить бесплатно 👌', 'getfree')]
    ])
  )
 
})

http
  .createServer()
  .listen(process.env.PORT || 5000)
  .on('request', res => res.end(''))

bot.launch()