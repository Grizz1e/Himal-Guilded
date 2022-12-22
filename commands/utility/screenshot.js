const { Embed } = require('guilded.ts')
const { filterURL } = require('../../Utils/functions')

module.exports = {
    name: 'screenshot',
    category: 'utility',
    description: 'Takes screenshot of given URL',
    args: ['url'],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['screenshot'])
        let input = filterURL(args[0])
        let url = input.startsWith('http://') || input.startsWith('https://') ? input : 'http://' + input
        let embed = new Embed()
            .setImage(`https://service.headless-render-api.com/screenshot/${url}`)
        message.reply({ embeds: [embed] })
    }
}