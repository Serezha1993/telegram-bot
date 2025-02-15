require('dotenv').config();
const {Bot, GrammyError, HttpError, Keyboard} = require('grammy');

const bot = new Bot(process.env.BOT_API_KEY);


bot.api.setMyCommands([
    {
        command: 'start',
        description: 'Запуск бота',
    },

    {
        command: 'mood',
        description: 'Оцунить настроение',
    },

    {
        command: 'share',
        description: 'Поделиться данными',
    },
]);

bot.command('start', async(ctx) => {
    await ctx.react('👍')
    await ctx.reply('Привет\\! Я бот\\. Тг канал: [это ссылка](https://t.me.pomazkovjs)', {
        parse_mod: 'MarkdownV2',
        disabled_web_page_preview: true
    });
});

 bot.command('mood', async(ctx) => {
    const moodLabels = ['Хорошо', 'Норм', 'Плохо']
    const rows = moodLabels.map((label) => {
        return [
            Keyboard.text(label)
        ]
    })
    const moodKeyboard = Keyboard.from(rows).resized()
        

 await ctx.reply('Как настроение..?', {
    reply_markup: moodKeyboard
 })
 })

bot.command('share', async(ctx) => {
    const shareKeyboard = new Keyboard().requestLocation('Геолокация').requestContact('Контакт').requestPoll('Опрос').placeholder('Укажи данные...').resized()
    await ctx.reply('Чем хочешь поделиться..?', {
        reply_markup:shareKeyboard
    })
})

bot.on(':contact', async(ctx) => {
    await ctx.reply('Спасибо за контакт')
})

 bot.hears('Хорошо', async(ctx) => {
    await ctx.reply('Класс', {
        reply_markup: {remove_keyboard: true}
    })
 })

bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;

    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram", e);
    } else {
        console.error("Unknown error", e);
    }
});

bot.start();