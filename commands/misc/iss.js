const fetch = require('node-fetch')
const { Embed } = require('guilded.ts')

module.exports = {
    name: 'iss',
    category: 'misc',
    description: 'Shows the current location of International Space Station',
    run: async (client, message, args) => {
        fetch('http://api.open-notify.org/iss-now.json').then(async (response) => {
            let data = await response.json()
            let lon = data.iss_position.longitude
            let lat = data.iss_position.latitude
            let embed = new Embed()
                .setTitle('Current location of ISS')
                .addField('Longitude', lon, true)
                .addField('Latitude', lat, true)
                .setImage(`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-l-airport+f74e4e(${lon},${lat})/${lon},${lat},2.65,0/600x450?access_token=pk.eyJ1IjoiZnJlc2hlcjg4OSIsImEiOiJjbDJlZzY0ODMwMGZxM2xwOWZjbmVqdnd1In0.j6bVs3UmqxA9V7lNmXSMtg&logo=false&attribution=false`)
                .setFooter('Map by: Mapbox & OpenStreetMap')
            message.reply({ embeds: [embed] })
        })
    }
}