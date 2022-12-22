const { Embed } = require('guilded.ts')
const fetch = require('node-fetch')

module.exports = {
    name: 'tod',
    category: 'games',
    description: 'Asks you a random Truth or Dare question',
    noArgs: true,
    args: ['todChoice'],
    run: async (client, message, args) => {
        let choices = ['truth', 'dare'], choice
        if (!args[0] || !choices.includes(args[0])) choice = choices[Math.floor(Math.random() * 2)]
        else choice = args[0]
        fetch(`https://api.truthordarebot.xyz/api/${choice}`).then(async (response) => {
            let res = await response.json()
            let embed = new Embed()
                .setTitle(`:interrobang: ${res.question}`)
                .setFooter(res.type)
            message.reply({ embeds: [embed] })
        })
    }
}