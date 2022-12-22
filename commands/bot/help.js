const { Embed } = require('guilded.ts')
const { prefix } = require('../../config.json').bot
const arg2Example = require('../../Utils/arg2Example.json')
module.exports = {
    name: 'help',
    category: 'bot',
    description: `Shows you all of the available commands of the bot`,
    noArgs: true,
    args: ['cmdName'],
    example: ['help', 'help iss'],
    run: async (client, message, args) => {
        if (args[0]) {
            const command = await client.commands.get(args[0]) || await client.commands.get(client.aliases.get(args[0]))
            if (!command) return
            let desc = command.description
            let aliases
            if (command.aliases) aliases = `\`${command.aliases.join('`, `')}\``
            else aliases = '**Not Available**'
            let embed = new Embed()
                .setAuthor(`${client.user.name}'s Help Menu`, 'https://img.guildedcdn.com/UserAvatar/51ec705f2217957f806f18cc2567fe2c-Large.webp')
                .setDescription(desc)

            if (command.subCommands) {
                let scArr = []
                let subCmds = ''
                let usage = ''
                let example = ''
                if (command.noArgs) {
                    example = usage = `${prefix}${command.name}\n`
                }
                for (let cmd of command.subCommands) {

                    if (!scArr.includes(cmd.name)) {
                        subCmds += `***${cmd.name}*** - ${cmd.description}\n`
                        scArr.push(cmd.name)
                    }

                    usage += `${prefix}${command.name} ${cmd.name}${cmd.args ? ` <${cmd.args.join('> <')}>` : ''}\n`
                    example += `${prefix}${command.name} ${cmd.name}${cmd.args ? ` ${cmd.args.map(arg => arg2Example[arg]).join(' ')}` : ''}\n`
                }
                embed.addField('__:arrow_lower_right: Subcommands__', subCmds)
                embed.addField('__:question: Usage__', `\`\`\`js\n${usage}\`\`\``)
                embed.addField('__:spiral_note_pad: Example__', `\`\`\`js\n${example}\`\`\``)
            } else if (command.args) {
                let usage = '', example = ''
                if (command.noArgs) {
                    example = usage = `${prefix}${command.name}\n`
                }


                for (let arg of command.args) {
                    let splittedArgs = arg.split(' ')
                    usage += `${prefix}${command.name}`
                    example += `${prefix}${command.name}`
                    for (let i of splittedArgs) {
                        usage += ` <${i}>`
                        example += ` ${arg2Example[i]}`
                    }
                    usage += '\n'
                    example += '\n'
                }
                embed.addField('__:question: Usage__', `\`\`\`js\n${usage}\`\`\``)
                embed.addField('__:spiral_note_pad: Example__', `\`\`\`js\n${example}\`\`\``)
            } else {
                let usage = `${prefix}${command.name}`
                let example = usage

                embed.addField('__:question: Usage__', `\`\`\`js\n${usage}\`\`\``)
                embed.addField('__:spiral_note_pad: Example__', `\`\`\`js\n${example}\`\`\``)
            }
            embed.addField(':currency_exchange: __Aliases__', aliases)
            message.reply({ embeds: [embed] })
        } else {
            let desc = `:question: • Prefix: \`${prefix}\`\n:point_right: • Command Help: \`${prefix}help <Command>\`\n:mag: • View all commands: \`${prefix}cmd\``
            let embed = new Embed()
                .setAuthor(client.user.name, 'https://img.guildedcdn.com/UserAvatar/51ec705f2217957f806f18cc2567fe2c-Large.webp')
                .setDescription(desc)
                .addField('Important Links', `[\`Invite ${client.user.name}\`](https://www.guilded.gg/b/92151c8b-2731-433b-a8d2-d051db1248e9) • [\`Support Server\`](https://guilded.gg/Himal)`)
                .setFooter('Total Commands: ' + client.commands.size)
            message.reply({ embeds: [embed] })
        }
    }
}