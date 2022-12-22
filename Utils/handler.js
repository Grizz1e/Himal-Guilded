const { readdirSync } = require('fs')
const { pathToFileURL } = require('url')

module.exports = (client) => {
    readdirSync('./commands/').forEach(dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'))
        for (const file of commands) {
            const pull = require(`../commands/${dir}/${file}`)
            if (pull.name) {
                client.commands.set(pull.name, pull)
            } else {
                continue
            }
            if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name))
        }
    })
}