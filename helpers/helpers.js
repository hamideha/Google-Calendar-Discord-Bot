const axios = require('axios');
const Discord = require('discord.js');
const getUrls = require('get-urls');

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc'),
    timezone = require('dayjs/plugin/timezone'),
    weekday = require('dayjs/plugin/weekday');
dayjs.extend(utc).extend(timezone).extend(weekday);

const startDate = dayjs().weekday(1).tz("America/New_York").format()
const endDate = dayjs().weekday(5).tz("America/New_York").format()


const getCalendar = async (Discord) => {
    const embedArray = [];

    // const calendarURL = `https://www.googleapis.com/calendar/v3/calendars/${process.env.TEST_CALENDAR_ID}/events?maxResults=2500&timeMin=${lastDate}&timeMax=${currDate}&key=${process.env.GOOGLE_KEY}`
    const calendarURL = `https://www.googleapis.com/calendar/v3/calendars/${process.env.CALENDAR_ID}/events?maxResults=2500&timeMin=${startDate}&timeMax=${endDate}&key=${process.env.GOOGLE_KEY}`

    const driveSubstringBegin = `https://drive.google.com/file/d/`
    const driveSubstringEnd = `/view?usp=drive_web`

    const { data } = await axios.get(calendarURL)
    const { items } = data
    items.map((item) => {
        var imageUrl = '', eventLinkSet = '', eventLink = ''

        if (item.attachments) { imageUrl = item.attachments[0].fileUrl }
        if (item.description) {
            eventLinkSet = getUrls(item.description);
            eventLink = eventLinkSet.values().next().value;
        }
        var imageId = (imageUrl.replace(driveSubstringBegin, '').replace(driveSubstringEnd, '')) || undefined

        const embedImageUrl = imageId ? `https://drive.google.com/uc?id=${imageId}` : undefined
        const summary = item.summary
        const startTime = dayjs(item.start.dateTime).tz("America/New_York").format('MM/DD/YYYY @ hh:mm:ss');

        const eventEmbed = new Discord.MessageEmbed()

        eventEmbed
            .setColor('#833037')
            .setAuthor('MacMSA Events')
            .setTitle(`${summary}`)
            .addFields(
                { name: 'Date:', value: `${startTime}` },
            )
            .setDescription(eventLink || '')
        if (embedImageUrl) { eventEmbed.setImage(embedImageUrl) }

        embedArray.push(eventEmbed)
    })
    return embedArray
}
getCalendar(Discord)
module.exports = { getCalendar }; 