const { Embed } = require("guilded.ts");

module.exports = {
    name: 'serverAdd',
    async execute(server, addedBy, client) {
        try {
            let embed = new Embed()
                .setTitle(`<@${addedBy.id}>, Thanks for inviting to ${server.name}`)
                .setDescription(`Hi, my name is ${client.user.name}. I'm a multipurpose Guilded bot. I can create engagements between the server members, show you some funny memes, moderate your server, welcome new members and even call random strangers (\`/call\`). Below are some of the points to remember when using the commands.\n\n> To get help, run \`/help\`\n\n> To get command help, run \`/help <Command name>\`\n\n> To view all command categories, run \`/cmd\`\n\n> To view commands of specific category, run \`/cmd <Category name>\`\n\n[Support Server](https://guilded.gg/Himal) [Invite Link](https://www.guilded.gg/b/92151c8b-2731-433b-a8d2-d051db1248e9)`)
                .setFooter('Made with ❤️ by Grizz1e')
            let channel = await client.channels.fetch(server.defaultChannelId)
            channel.send({ embeds: [embed] })
            client.logChannel.send(`➕ I was added to ${server.name}`)
        } catch (err) {
            return
        }
    },
};