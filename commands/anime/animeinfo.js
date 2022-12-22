const fetch = require('node-fetch')
const { Embed } = require('guilded.ts')
const moment = require('moment')

module.exports = {
    name: 'animeinfo',
    category: 'anime',
    description: 'Shows you information about the given anime',
    args: ['anime'],
    run: async (client, message, args) => {
        if (!args[0]) return message.reply(`❌ No name provided for the anime`)

        fetch(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(args.join(' '))}`).then(async (response) => {
            let res = await response.json()
            let data = res.data[0]
            if (!data || data.length < 1) return message.reply(`⚠️ | No result found for your search term!`)
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
                    .addField('Current status', statuses[data.attributes.status], true)
                    .addField(`:heartbeat: Air Time`, `\`${moment(data.attributes.startDate).format('D MMMM, YYYY')}\` - \`${data.attributes.endDate ? `${moment(data.attributes.endDate).format('D MMMM, YYYY')}` : 'current'}\``)
                data.attributes.nextRelease ? embed.addField(':fast_forward: Next release', `\`${moment(data.attributes.nextRelease).format('D MMMM, YYYY')}\`\n(${moment(data.attributes.nextRelease).fromNow()})`) : ''
                data.attributes.episodeCount ? embed.addField(`:tv: Total Episodes`, `\`${data.attributes.episodeCount.toLocaleString()}\``) : ''
                embed.addField(':medal: Ratings', `Average Rating: \`${data.attributes.averageRating}\`\n${data.attributes.ageRating} (${data.attributes.ageRatingGuide})`)
                    .setFooter(`Last Updated: ${moment(data.attributes.updatedAt).format('D MMMM, YYYY')}`)
                message.reply({ embeds: [embed] })
            }
        })
    }
}