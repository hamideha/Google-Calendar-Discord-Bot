const Discord = require('discord.js');
const client = new Discord.Client();
const CronJob = require('cron').CronJob;

require('dotenv').config()

const { getCalendar } = require('./helpers/helpers')

client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}, ${client.user.id}`);
    var job = new CronJob('00 00 10 * * 1', () => {
        console.log('CRON successful')
        getCalendar(Discord)
            .then(data => {
                data.map((embed) => {
                    client.channels.cache.get(process.env.CHANNEL_ID).send(embed)
                })
            })
    }, null, true, 'America/Toronto');
    job.start();
})

// getCalendar().then(data => client.channels.cache.get(process.env.CHANNEL_ID).send(data));
// client.channels.cache.get(process.env.CHANNEL_ID).send("Message");
// client.on('message', message => {
//     message.channel.send("MHEK");
// })

client.login(process.env.DISCORD_TOKEN);