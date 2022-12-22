const { Embed } = require('guilded.ts')
const moment = require('moment')
const fetch = require('node-fetch')

module.exports = {
    name: 'noviews',
    category: 'misc',
    description: 'Shows you a random live Twitch channel with no views',
    run: async (client, message, args) => {
        fetch(`https://nobody.live/stream`).then(async (response) => {
            let res = await response.json()
            let data = res[0]
            let embed = new Embed()
                .setAuthor(data.user_name, `https://cdn130.picsart.com/293712329019211.png`)
                .setTitle(data.title)
                .setUrl(`https://twitch.tv/${data.user_name}`)
                .setDescription(`Be the first person to watch **${data.user_name}** streaming${data.game_name.length > 0 ? ` **${data.game_name}**` : ''}\nCurrently streaming to **${data.viewer_count}** viewers\n\n[**Click Here to Watch**](https://twitch.tv/${data.user_name})`)
                .setImage(data.thumbnail_url.replace('{width}', '1920').replace('{height}', '1080'))
                .setFooter(`Started streaming ${moment(data.started_at).fromNow()}`)
            message.reply({ embeds: [embed] })
        })
    }
}