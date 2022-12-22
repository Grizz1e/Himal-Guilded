const { Embed } = require('guilded.ts')
const fetch = require('node-fetch')
const { embedFieldTrimmer } = require('../../Utils/functions.js')

module.exports = {
    name: 'dictionary',
    category: 'utility',
    description: 'Gets you the definition of a word',
    args: ['word'],
    aliases: ['define'],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['dictionary'])
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(args.join(' '))}`).then(async (response) => {
            let body = await response.json()
            let embed = new Embed()
                .setTitle(body[0].word)
            let array = []
            for (let i in body[0].meanings) {
                let pos = body[0].meanings[i].partOfSpeech
                for (let j in body[0].meanings[i].definitions) {
                    let defns = body[0].meanings[i].definitions[j].definition
                    array.push('- ' + defns)
                }
                let def = array.join('\n')
                let definitions = embedFieldTrimmer(def)
                for (let x in definitions) {
                    if (x < 25)
                        embed.addField(`${pos} [${Number(x) + 1}]`, definitions[x])
                    else break
                }
                array = []
            }

            message.reply({ embeds: [embed] })

        }).catch((err) => {
            console.log(err)
            message.reply('⚠️ Could not find the definition for that word')
        })
    }
}