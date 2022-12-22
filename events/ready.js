const { Database } = require('quickmongo')
const { url } = require('../config.json').mongodb
const { log_channel } = require('../config.json').bot

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        client.db = new Database(url)
        client.logChannel = await client.channels.fetch(log_channel)
        client.db.on("ready", () => {
            console.log("Connected to the database");
        });
        await client.db.connect();
        console.log(`Logged in as ${client.user.name}!`);
    },
};