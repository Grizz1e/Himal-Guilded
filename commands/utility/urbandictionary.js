const { Embed } = require('guilded.ts')
const fetch = require('node-fetch')

module.exports = {
    name: 'urbandictionary',
    category: 'utility',
    description: 'Looks at urbandictionary for the given word',
    args: ['word'],
    aliases: ['urban'],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['urbandictionary'])
        fetch(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(args.join(' '))}`).then(async (response) => {
            let res = await response.json()
            let body = res.list
            if (!body) return message.reply('⚠️ No definition found')
            var define = body[0].definition
            let definition = define.replace(/\[|\]/g, '`')
            var ex = body[0].example
            let example = ex.replace(/\[|\]/g, '`')
            let embed = new Embed()
                .setAuthor(`✍ ${body[0].author}`)
                .setTitle(body[0].word)
                .setUrl(body[0].permalink)
                .addField(`Definition`, definition)
                .addField(`Example`, example || 'N/A')
                .setFooter(`👍 ${body[0].thumbs_up} | 👎 ${body[0].thumbs_down}`)
            message.reply({ embeds: [embed] })

        }).catch((err) => {
            console.log(err)
            message.reply('⚠️ An error occurred')
        });
    }
}