module.exports = {
    name: "ping",
    description: "Sends you the latency of the bot",
    category: "bot",
    run: async (client, message, args) => {
        let ping = await client.ws.ping
        message.reply(`${ping}`)
    }
}