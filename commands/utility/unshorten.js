const fetch = require('node-fetch')

module.exports = {
    name: 'unshorten',
    category: 'utility',
    description: 'Expands the short links to reveal their real redirect URLs',
    args: ['shortUrl'],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['unshorten'])
        let url = args[0].split('](')[0].replace('[', "")
        fetch(`https://bypass.bot.nu/bypass2?url=${url}`).then(async (response) => {
            let res = await response.json()
            message.reply(res.destination)
        }).catch((err) => {
            message.reply("❌ | Unsupported URL")
        })
    }
}