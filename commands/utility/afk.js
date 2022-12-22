const { isPremiumUsr } = require('../../Utils/functions')

module.exports = {
    name: 'afk',
    category: 'utility',
    description: 'Sets you to AFK status and informs anyone that mentions you',
    noArgs: true,
    subCommands: [
        {
            name: 'setmessage',
            description: 'Set custom AFK message or remove if none is provided',
            args: ['textMessage']
        }, {
            name: 'setmessage',
            description: 'Set custom AFK message'
        }
    ],
    run: async (client, message, args) => {
        if (args[0] && args[0] === 'setmessage') {
            let premiumUsr = await isPremiumUsr(message.authorId, client)
            if (!premiumUsr) return message.reply('❌ You need to be a premium user. Join our support server to buy premium\nhttps://guilded.gg/Himal')
            else if (args[1]) {
                args.splice(0, 1)
                if (args.join(' ').length > 200) return message.reply('❌ AFK message cannot be longer than 200 characters')
                await client.db.set(`${message.authorId}.afkMsg`, args.join(' '))
                return message.reply('✅ Successfully changed the AFK message')
            } else {
                await client.db.delete(`${message.authorId}.afkMsg`)
                return message.reply(`✅ Successfully deleted the custom AFK message`)
            }
        }

        let afkUsers = await client.db.get(`afkUsers`)
        if (!afkUsers) {
            await client.db.set('afkUsers', [message.authorId])
            message.reply('✅ Successfully set your status to AFK')
        } else {
            let usr = (id) => id === message.authorId
            if (afkUsers.some(usr)) {
                const index = afkUsers.indexOf(message.id);
                afkUsers.splice(index, 1);
                await client.db.set('afkUsers', afkUsers)
                message.reply('👋 Welcome back! I have removed your AFK status')
            } else {
                afkUsers.push(message.authorId)
                await client.db.set('afkUsers', afkUsers)
                message.reply('✅ Successfully set your status to AFK')
            }
        }
    }
}