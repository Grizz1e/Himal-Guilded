const { Embed } = require('guilded.ts')
const fetch = require('node-fetch')
const { imgbun } = require('../../config.json').api

module.exports = {
  name: 'text2img',
  category: 'utility',
  description: 'Converts your text into image',
  args: ['textMessage'],
  run: async (client, message, args) => {
    if (!args[0]) return client.commands.get('help').run(client, message, ['text2img'])
    fetch(`https://api.imgbun.com/jpg?key=${imgbun}&format=json&text=${encodeURIComponent(args.join(' '))}&size=40`).then(async (response) => {
      let res = await response.json()
      let embed = new Embed()
        .setImage(res.direct_link)
      message.reply({ embeds: [embed] })
    }).catch(function (error) {
      console.error(error);
    });
  }
}