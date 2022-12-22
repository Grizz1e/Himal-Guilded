const { readdirSync } = require("fs");
const { Embed } = require('guilded.ts')
const { prefix } = require('../../config.json').bot
const { getCat } = require('../../Utils/functions.js')

module.exports = {
    name: 'cmd',
    category: 'bot',
    description: 'Shows you all of the available commands of the bot inside the category',
    noArgs: true,
    args: ['cmdCategory'],
    run: async (client, message, args) => {
        if (args[0]) {
            let cat = args[0].toLowerCase()
            let cmd
            if ((cmd = getCat(cat)) === null) {
                return message.reply(`❌ | Invalid category. Try running \`${prefix}cmd\``)
            }
            const dirs = readdirSync(`./commands/${cat}`).filter(file => file.endsWith(".js"))
            let cmds = `\`${dirs.join('` • `').replace(/.js/g, '')}\``
            let randir = dirs[Math.floor(Math.random() * dirs.length)].replace('.js', '')

            let embed = new Embed()
                .setAuthor(`${client.user.name}'s Command Menu`, 'https://img.guildedcdn.com/UserAvatar/51ec705f2217957f806f18cc2567fe2c-Large.webp')
                .setDescription(`• Type \`${prefix}help [Command]\` for more info on that command\nExample: \`${prefix}help ${randir}\`\n\n ${cmd}\n${cmds}`)
            message.reply({ embeds: [embed] })

        } else {
            let embed = new Embed()
            let desc = `• Type the command shown below to view all the commands of that category\nExample: \`${prefix}cmd bot\``
            const commands = await client.commands;

            let com = {};
            for (let comm of commands) {
                comm = comm[1]
                let category = comm.category || "Unknown";
                let name = comm.name;

                if (!com[category]) {
                    com[category] = [];
                }
                com[category].push(name);
            }
            for (const [key, value] of Object.entries(com)) {
                let category = key;
                cat = getCat(category)
                embed.addField(`** ${cat} ** `, `[\`${prefix}cmd ${category}\`](https://guilded.gg/Himal)`, true);
            }

            embed.setAuthor(client.user.name, 'https://img.guildedcdn.com/UserAvatar/51ec705f2217957f806f18cc2567fe2c-Large.webp')
                .setDescription(desc)
            message.reply({ embeds: [embed] })
        }
    }
}