require('dotenv').config({ path: './config/.local.env' });
const fetch = require('node-fetch');
const Discord = require('discord.js');
const connectDB = require('./config/db');
const { articleExistsCNBC, addArticle } = require('./controllers/cnbc');
const bot = new Discord.Client();
const { TOKEN, NEWS_API_URL, UPDATE_TIME, CHANNEL_NAME } = process.env;

bot.login(TOKEN);

connectDB();

let channel;
bot.on('ready', () => {
    console.log(`Bot Logged In`);
    const channel_map = bot.channels.cache.filter(({ type, name }) => type === 'text' && name === CHANNEL_NAME);
    const channel_id = channel_map.toJSON()[0].id
    channel = bot.channels.cache.get(channel_id);

    setInterval(() => { getNews() }, UPDATE_TIME * 1000);
});

const getNews = async () => {
    try {
        const res = await fetch(NEWS_API_URL)
        const json = await res.json();
        const { data: { newsAlert: { breakingNews } } } = json;
        if (breakingNews && !await articleExistsCNBC(breakingNews.title, breakingNews.url)) {
            addArticle({
                title: breakingNews.title,
                url: breakingNews.url
            })
            channel.send(breakingNews.url)
        }
    } catch (err) {
        console.log(err)
        return err;
    }
}