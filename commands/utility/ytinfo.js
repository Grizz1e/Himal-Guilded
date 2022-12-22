const fetch = require("node-fetch");
const { Embed } = require("guilded.ts");
const yt = require('youtube-sr').default
const { filterURL, sec2HrMinSec } = require('../../Utils/functions.js');

module.exports = {
    name: 'ytinfo',
    category: 'utility',
    description: 'Get YouTube video dislikes, sponsored segments and more',
    args: ['ytUrl', 'searchQuery'],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['dislikes'])
        let url = filterURL(args[0])
        let isValidURL = await yt.validate(url, 'VIDEO')
        let vidInfo
        if (!isValidURL) {
            vidInfo = await yt.searchOne(args.join(' '))
            if (!vidInfo) return message.reply('⚠️ No result found for your search term')
            url = `https://youtu.be/${vidInfo.id}`
        } else {
            vidInfo = await yt.getVideo(url)
        }
        let id = vidInfo.id
        fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${id}`).then(async (response) => {
            let res = await response.json()
            let sbRes
            let sbResponse = await fetch(`https://sponsor.ajay.app/api/skipSegments?videoID=${id}&categories=["sponsor","intro","outro","selfpromo","interaction","preview","music_offtopic","filler"]`)
            try {
                sbRes = await sbResponse.json()
            } catch (err) {
                sbRes = false
            }
            let embed = new Embed()
                .setAuthor({ name: vidInfo.channel.name, icon_url: vidInfo.channel.icon.url })
                .setTitle(vidInfo.title)
                .setUrl(url)
                .setThumbnail(vidInfo.thumbnail.url)
                .addField('👍 Likes', `\`${res.likes.toLocaleString()}\``, true)
                .addField('👎 Dislikes', `\`${res.dislikes.toLocaleString()}\``, true)
                .addField('⭐ Overall Rating', `\`${res.rating.toFixed(1)}\``, true)
            if (sbRes) {
                let selfpromo = '', sponsor = '', intro = '', outro = '', filler = '', music_offtopic = ''
                sbRes.forEach((el) => {
                    segment = `[${sec2HrMinSec(el.segment[0])}](https://youtu.be/${id}?t=${Math.round(el.segment[0])}) - [${sec2HrMinSec(el.segment[1])}](https://youtu.be/${id}?t=${Math.round(el.segment[1])})\n`
                    if (el.category === 'selfpromo') selfpromo += segment
                    else if (el.category === 'sponsor') sponsor += segment
                    else if (el.category === 'intro') intro += segment
                    else if (el.category === 'outro') outro += segment
                    else if (el.category === 'filler') filler += segment
                    else if (el.category === 'music_offtopic') music_offtopic += segment
                })
                if (sponsor) embed.addField('Sponsor', sponsor, true)
                if (selfpromo) embed.addField('Self Promotion', selfpromo, true)
                if (intro) embed.addField('Intro', intro, true)
                if (outro) embed.addField('Outro', outro, true)
                if (filler) embed.addField('Filler', filler, true)
                if (music_offtopic) embed.addField('Music Offtopic', music_offtopic, true)
            }
            message.reply({ embeds: [embed] })
        })
    }
}