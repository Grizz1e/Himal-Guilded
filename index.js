const { Client } = require('guilded.ts')
const { token } = require('./config.json').bot
const fs = require('fs')

const client = new Client()

client.commands = new Map()
client.aliases = new Map();
client.callStatus = new Map()

require(`./Utils/handler`)(client);

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'))
for (const file of eventFiles) {
    const event = require(`./events/${file}`)
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client))
    } else {
        client.on(event.name, (...args) => event.execute(...args, client))
    }
}

client.login(token)
process.on('unhandledRejection', (err) => {
    console.error(err)
})