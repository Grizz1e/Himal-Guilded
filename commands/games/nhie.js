const { Embed } = require('guilded.ts')
const fetch = require('node-fetch')

module.exports = {
    name: 'nhie',
    category: 'games',
    description: 'Asks you a random Never Have I Ever question',
    run: async (client, message, args) => {
        fetch(`https://api.nhie.io/v1/statements/random`).then(async (response) => {
            let res = await response.json()
            let embed = new Embed()
                .setTitle(`:interrobang: ${res.statement}`)
            message.reply({ embeds: [embed] })
        })
    }
}