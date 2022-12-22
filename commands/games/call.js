const { Embed } = require("guilded.ts")

module.exports = {
    name: 'call',
    category: 'games',
    description: 'Call a random server and start a chat',
    run: async (client, message, args) => {
        let callerList = await client.db.get('callStatus')
        if (!callerList) callerList = []
        let checkServer = (caller) => caller.serverId === message.serverId
        if (!callerList || !callerList.some(checkServer)) {
            let embed = new Embed()
            let serverInfo = {
                serverId: message.serverId,
                callFrom: message.channelId,
                callTo: null
            }
            let found = false
            embed.setTitle('📞 Initiating a call...')
                .setDescription('Remember, you can use `/call` anytime to hang up the call')
            await message.reply({ embeds: [embed] })
            for (let caller of callerList) {
                if (!caller.callTo) {
                    found = true
                    caller.callTo = message.channelId
                    serverInfo.callTo = caller.callFrom
                    break
                }
            }
            callerList.push(serverInfo)
            await client.db.set('callStatus', callerList)
            if (found) {
                embed.setTitle('✅ A connection has been established!')
                    .setDescription(`Please be civil when chatting with strangers and NEVER share any personal details`)
                    .setColor('Green')
                let callToChannel = await client.channels.fetch(serverInfo.callTo)
                await message.channel.send({ embeds: [embed] })
                callToChannel.send({ embeds: [embed] })
            }
        } else {
            let thisServer = callerList.filter(caller => caller.serverId === message.serverId)[0]
            let embed = new Embed()
            if (thisServer.callFrom !== message.channelId) {
                embed.setTitle(`❌ A call has already been initiated from another channel`)
                return message.reply({ embeds: [embed] })
            }
            let filteredList
            if (thisServer.callTo) {
                filteredList = callerList.filter(caller => caller.serverId !== message.serverId && caller.callFrom !== thisServer.callTo)
                embed.setTitle('⚠️ Another party hung up the call')
                let callToChannel = await client.channels.fetch(thisServer.callTo)
                await callToChannel.send({ embeds: [embed] })
            } else {
                filteredList = callerList.filter(caller => caller.serverId !== message.serverId)
            }
            if (!filteredList) filteredList = []
            await client.db.set('callStatus', filteredList)
            embed.setTitle('✅ Disconnected from the call')
            message.reply({ embeds: [embed] })
        }
    }
}