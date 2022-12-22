const fetch = require('node-fetch')
const { Embed } = require('guilded.ts')

module.exports = {
    name: 'pickupline',
    category: 'fun',
    description: "Gives you random pickup line from r/pickuplines",
    aliases: ['pl'],
    run: async (client, message, args) => {
        fetch('https://www.reddit.com/r/pickuplines/random.json').then(async (response) => {
            let res = await response.json()
            let data = res[0].data.children[0].data
            let title = data.title
            let desc = data.selftext
            let author = data.author
            let embed = new Embed()
                .setDescription(`**${title}**${!!desc ? `\n\n${desc}` : ''}`)
                .setFooter(`u/${author}`)
            message.reply({ embeds: [embed] })
        })
    }
}