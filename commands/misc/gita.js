const fetch = require('node-fetch')
const { Embed } = require('guilded.ts')
const { gitaslokid } = require('../../Utils/functions.js')

module.exports = {
    name: 'gita',
    category: 'misc',
    description: 'Shows you a random verse from Bhagvad Gita',
    run: async (client, message, args) => {
        fetch(`https://bhagavadgitaapi.in/slok/${gitaslokid()}`).then(async (response) => {
            let data = await response.json()
            let desc = `**${data.slok}**\n\n${data.transliteration}\n\n${data.tej.ht}\n\n${data.gambir.et}`
            let embed = new Embed()
                .setDescription(desc)
                .setFooter(`Bhagvad Gita, Chapter ${data.chapter}, Verse ${data.verse}`)
            message.reply({ embeds: [embed] })
        })
    }
}