const { Embed } = require('guilded.ts')
const { filterURL } = require('../../Utils/functions.js')

module.exports = {
    name: 'embed',
    description: 'Creates embed *(20 seconds for each question)*',
    category: 'admin',
    run: async (client, message, args) => {
        let title, desc, footerText, authorName, thumb, image, authorIcon, footerIcon
        let sendChannel = message.channel
        let embedGen = new Embed()
        try {
            let server = await client.servers.fetch(message.serverId)
            let usr = await server.members.fetch(message.authorId)
            if (!usr.isOwner) return message.reply('❌ As of now, only server owner can use moderation commands')
            let guideMsg = 'Send the following message in chat to customize embed:\n**author** - Set author name and icon\n**title** - Set the title\n**url** - Set the URL\n**desc** - Set the description\n**thumb** - Set the thumbnail\n**image** - Set the image\n**footer** - Set the footer name and icon\n**channel** - Set the channel to send embed\n**send** - Send the embed'
            let askEmbed = new Embed()
                .setTitle('Embed generator')
                .setFooter('You have 20 seconds')
            while (true) {
                let authorNameCheck = embedGen.author ? embedGen.author.name ? ':white_check_mark:' : ':x:' : ':x:'
                let authorIconCheck = embedGen.author ? embedGen.author.icon_url ? ':white_check_mark:' : ':x:' : ':x:'
                let titleCheck = embedGen.title ? ':white_check_mark:' : ':x:'
                let descriptionCheck = embedGen.description ? ':white_check_mark:' : ':x:'
                let footerTextCheck = embedGen.footer ? embedGen.footer.text ? ':white_check_mark:' : ':x:' : ':x:'
                let footerIconCheck = embedGen.footer ? embedGen.footer.icon_url ? ':white_check_mark:' : ':x:' : ':x:'
                let thumbnailCheck = embedGen.thumbnail ? embedGen.thumbnail.url ? ':white_check_mark:' : ':x:' : ':x:'
                let imageCheck = embedGen.image ? embedGen.image.url ? ':white_check_mark:' : ':x:' : ':x:'

                askEmbed.setDescription(`${authorNameCheck} Author Name\n${authorIconCheck} Author Icon\n${titleCheck} Title\n${descriptionCheck} Description\n${thumbnailCheck} Thumbnail\n${imageCheck} Image\n${footerTextCheck} Footer Text\n${footerIconCheck} Footer Icon\nChannel: #${sendChannel.name}\n\n${guideMsg}`)
                await message.reply({ embeds: [askEmbed] })
                let msg = await message.channel.awaitMessages({
                    max: 1,
                    time: 20_000,
                    filter: (msg) => msg.authorId === message.authorId
                })
                if (!msg) return
                else {
                    let choice = msg.first()
                    if (choice.content === 'send') {
                        return sendChannel.send({ embeds: [embedGen] })
                    } else if (choice.content === 'author') {
                        askEmbed.setDescription(`${authorNameCheck} Author Name\n${authorIconCheck} Author Icon\n\nSend the following message in chat to customize embed:\n**name** - Set the author name\n**icon** - Set the author icon`)
                        await choice.reply({ embeds: [askEmbed] })
                        let authorMsg = await message.channel.awaitMessages({
                            max: 1,
                            time: 20_000,
                            filter: (msg) => msg.authorId === message.authorId
                        })
                        if (!authorMsg) return
                        else {
                            let authorChoice = authorMsg.first()
                            if (authorChoice.content === 'name') {
                                askEmbed.setDescription('Please enter the author name')
                                await authorChoice.reply({ embeds: [askEmbed] })
                                let authorNameMsg = await message.channel.awaitMessages({
                                    max: 1,
                                    time: 20_000,
                                    filter: (msg) => msg.authorId === message.authorId
                                })
                                if (!authorNameMsg) return
                                else {
                                    authorName = authorNameMsg.first().content
                                    let authorData = { name: authorName }
                                    if (authorIcon) authorData.icon_url = authorIcon
                                    embedGen.setAuthor(authorData)
                                }
                            } else if (authorChoice.content === 'icon') {
                                askEmbed.setDescription('Please enter the author icon URL')
                                await authorChoice.reply({ embeds: [askEmbed] })
                                let authorIconMsg = await message.channel.awaitMessages({
                                    max: 1,
                                    time: 20_000,
                                    filter: (msg) => msg.authorId === message.authorId
                                })
                                if (!authorIconMsg) return
                                else {
                                    authorIcon = filterURL(authorIconMsg.first().content)
                                    let authorData = { icon_url: authorIcon }
                                    if (authorName) authorData.name = authorName
                                    embedGen.setAuthor(authorData)
                                }
                            } else {
                                return
                            }
                        }
                    } else if (choice.content === 'footer') {
                        askEmbed.setDescription(`${footerTextCheck} Footer Text\n${footerIconCheck} Footer Icon\n\nSend the following message in chat to customize embed:\n**text** - Set the footer text\n**icon** - Set the author icon`)
                        await choice.reply({ embeds: [askEmbed] })
                        let footerMsg = await message.channel.awaitMessages({
                            max: 1,
                            time: 20_000,
                            filter: (msg) => msg.authorId === message.authorId
                        })
                        if (!footerMsg) return
                        else {
                            let footerChoice = footerMsg.first()
                            if (footerChoice.content === 'text') {
                                askEmbed.setDescription('Please enter the footer text')
                                await footerChoice.reply({ embeds: [askEmbed] })
                                let footerTextMsg = await message.channel.awaitMessages({
                                    max: 1,
                                    time: 20_000,
                                    filter: (msg) => msg.authorId === message.authorId
                                })
                                if (!footerTextMsg) return
                                else {
                                    footerText = footerTextMsg.first().content
                                    let footerData = { text: footerText }
                                    if (footerIcon) footerData.icon_url = footerIcon
                                    embedGen.setFooter(footerData)
                                }
                            } else if (footerChoice.content === 'icon') {
                                askEmbed.setDescription('Please enter the footer icon URL')
                                await footerChoice.reply({ embeds: [askEmbed] })
                                let footerIconMsg = await message.channel.awaitMessages({
                                    max: 1,
                                    time: 20_000,
                                    filter: (msg) => msg.authorId === message.authorId
                                })
                                if (!footerIconMsg) return
                                else {
                                    footerText = filterURL(footerIconMsg.first().content)
                                    let footerData = { icon_url: footerIcon }
                                    if (footerText) footerData.text = footerText
                                    embedGen.setAuthor(footerData)
                                }
                            } else {
                                return
                            }
                        }
                    } else if (choice.content === 'title') {
                        askEmbed.setDescription('Please enter the title')
                        await choice.reply({ embeds: [askEmbed] })
                        let titleMsg = await message.channel.awaitMessages({
                            max: 1,
                            time: 20_000,
                            filter: (msg) => msg.authorId === message.authorId
                        })
                        if (!titleMsg) return
                        else {
                            title = titleMsg.first().content
                            embedGen.setTitle(title)
                        }
                    } else if (choice.content === 'desc') {
                        askEmbed.setDescription('Please enter the description')
                        await choice.reply({ embeds: [askEmbed] })
                        let descMsg = await message.channel.awaitMessages({
                            max: 1,
                            time: 20_000,
                            filter: (msg) => msg.authorId === message.authorId
                        })
                        if (!descMsg) return
                        else {
                            desc = descMsg.first().content
                            embedGen.setDescription(desc)
                        }
                    } else if (choice.content === 'thumb') {
                        askEmbed.setDescription('Please enter the thumbnail URL')
                        await choice.reply({ embeds: [askEmbed] })
                        let thumbMsg = await message.channel.awaitMessages({
                            max: 1,
                            time: 20_000,
                            filter: (msg) => msg.authorId === message.authorId
                        })
                        if (!thumbMsg) return
                        else {
                            thumb = filterURL(descMsg.first().content)
                            embedGen.setThumbnail(thumb)
                        }
                    } else if (choice.content === 'image') {
                        askEmbed.setDescription('Please enter the thumbnail URL')
                        await choice.reply({ embeds: [askEmbed] })
                        let imageMsg = await message.channel.awaitMessages({
                            max: 1,
                            time: 20_000,
                            filter: (msg) => msg.authorId === message.authorId
                        })
                        if (!imageMsg) return
                        else {
                            image = filterURL(imageMsg.first().content)
                            embedGen.setImage(image)
                        }
                    } else if (choice.content === 'channel') {
                        askEmbed.setDescription('Please mention the channel to send the embed')
                        await choice.reply({ embeds: [askEmbed] })
                        let channelMsg = await message.channel.awaitMessages({
                            max: 1,
                            time: 20_000,
                            filter: (msg) => msg.authorId === message.authorId
                        })
                        if (!channelMsg || !channelMsg.first().mentions || !channelMsg.first().mentions.channels) return
                        else {
                            sendChannel = await client.channels.fetch(channelMsg.first().mentions.channels[0].id)
                        }
                    } else {
                        return
                    }
                }
            }
        } catch (err) {
            message.reply(`⚠️ ${err.message}`)
        }
    }
}