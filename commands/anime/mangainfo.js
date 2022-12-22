const fetch = require('node-fetch')
const { Embed } = require('guilded.ts')
const moment = require('moment')

module.exports = {
    name: 'mangainfo',
    category: 'anime',
    description: 'Shows you information about the given manga',
    args: ['manga'],
    run: async (client, message, args) => {
        if (!args[0]) return message.reply(`❌ No name provided for the manga`)

        fetch(`https://kitsu.io/api/edge/manga?filter[text]=${encodeURIComponent(args.join(' '))}`).then(async (response) => {
            let res = await response.json()
            let data = res.data[0]
            if (data.length < 1) return message.channel.send(`⚠️ | No result!`)
            else {
                let statuses = {
                    'current': 'Currently airing',
                    'finished': 'Finished airing',
                    'tba': 'TBA',
                    'unreleased': 'Unreleased',
                    'upcoming': 'Upcoming'
                }
                let embed = new Embed()
                    .setAuthor(data.attributes.canonicalTitle)
                    .setImage(data.attributes.coverImage.large)
                    .setThumbnail(data.attributes.posterImage.original)
                    .setDescription(data.attributes.description.length > 2048 ? data.attributes.description.substr(0, 2045) + '...' : data.attributes.description)
                    .addField(`:heartbeat: Air Time`, `\`${moment(data.attributes.startDate).format('D MMMM, YYYY')}\` - \`${data.attributes.endDate ? `${moment(data.attributes.endDate).format('D MMMM, YYYY')}` : 'current'}\``)
                data.attributes.nextRelease ? embed.addField(':fast_forward: Next release', `\`${moment(data.attributes.nextRelease).format('D MMMM, YYYY')}\`\n(${moment(data.attributes.nextRelease).fromNow()})`) : ''
                embed.addField(':medal: Ratings', `Average Rating: \`${data.attributes.averageRating}\`\n${data.attributes.ageRating} (${data.attributes.ageRatingGuide})`)
                    .setFooter(`Last Updated: ${moment(data.attributes.updatedAt).format('D MMMM, YYYY')}`)
                message.reply({ embeds: [embed] })
            }
        })
    }
}