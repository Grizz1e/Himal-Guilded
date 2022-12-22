const { Embed } = require('guilded.ts/dist')
const { isPremiumUsr } = require('../Utils/functions')

const { prefix } = require('../config.json').bot

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.type === 'system' || message.createdByWebhookId) return
        try {
            let msgUsr = await client.users.fetch(message.serverId, message.authorId)
            if (!msgUsr || msgUsr.type === 'bot') return
            if (message.authorId === client.user.id) return;
            if (message.mentions && message.mentions.users) {
                let afkUsers = await client.db.get('afkUsers')
                let embed = new Embed()
                    .setTitle('⚠️ The person you are mentioning is currently AFK')
                message.mentions.users.forEach(async (user) => {
                    const usrCheck = (id) => id === user.id
                    if (afkUsers.some(usrCheck)) {
                        let checkAfkEnable = await client.db.get(`${message.serverId}.showAfk`)
                        if (checkAfkEnable === undefined || checkAfkEnable === null) {
                            if (await isPremiumUsr(user.id, client)) {
                                let afkMsg = await client.db.get(`${user.id}.afkMsg`)
                                if (afkMsg) {
                                    embed.setDescription(await client.db.get(`${user.id}.afkMsg`))
                                }
                            }
                            message.reply({ embeds: [embed] })
                        }
                    }
                })
            }
            if (!message.content.startsWith(prefix)) {
                let callerList = await client.db.get('callStatus')
                if (callerList.some((caller) => caller.serverId === message.serverId)) {
                    let callingInfo = callerList.filter(caller => caller.serverId === message.serverId)[0]
                    if (!callingInfo.callTo) return
                    else {
                        let toSendChannel = await client.channels.fetch(callingInfo.callTo)
                        if (!toSendChannel) {
                            let filteredList = callerList.filter(caller => caller.serverId !== message.serverId && caller.callFrom !== callingInfo.callTo)
                            await client.db.set('callStatus', filteredList)
                        } else {
                            let toSendContent = message.content.length > 200 ? ' `' + msgUsr.name + '`: ' + message.content.substr(0, 200) : ' `' + msgUsr.name + '`: ' + message.content
                            toSendChannel.send(toSendContent)
                        }
                    }

                }
            } else {
                const args = message.content.slice(prefix.length).trim().split(/ +/g);
                const cmd = args.shift().toLowerCase();
                if (cmd.length === 0) return;

                let command = client.commands.get(cmd);
                if (!command) command = client.commands.get(client.aliases.get(cmd));
                if (command) {
                    command.run(client, message, args);
                }
            }
        } catch (err) {
            message.reply("An error occurred!\n " + err.message)
        }
    }
}