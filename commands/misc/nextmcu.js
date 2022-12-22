const fetch = require('node-fetch')
const { Embed } = require('guilded.ts')

module.exports = {
    name: 'nextmcu',
    category: 'misc',
    description: 'Shows the release date for next MCU project',
    aliases: ['mcu'],
    run: async (client, message, args) => {
        fetch('https://www.whenisthenextmcufilm.com/api').then(async (response) => {
            let data = await response.json()
            let embed = new Embed()
                .setTitle(`${data.title} releases in ${data.days_until} days!`)
                .setDescription(`**Plot:** ${data.overview}\n\n**Next Release:** ${data.following_production.title}`)
                .setImage(data.poster_url)
                .setFooter(`Release date: ${data.release_date}`)
            message.reply({ embeds: [embed] })
        })
    }
}