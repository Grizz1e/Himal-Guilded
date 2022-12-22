const math = require('mathjs')

module.exports = {
    name: 'calculate',
    category: 'utility',
    description: 'Calculates the given math problem',
    args: ['calculation'],
    aliases: ['calc'],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['calculate'])
        let resp;
        try {
            resp = math.evaluate(args.join(' '));
        } catch (e) {
            return message.reply(`⚠️ | Invalid calculation provided`);
        }
        let desc = ` \`${args.join(' ')}\` = \`${resp.toFixed(2)}\``
        message.reply(desc)
    }
}