const { Embed } = require('guilded.ts')
const fetch = require('node-fetch')
const { whois } = require('../../config.json').api

module.exports = {
    name: 'whois',
    category: 'utility',
    description: 'Shows the whois information of given domain',
    args: ['domain'],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['whois'])
        let response
        try {
            response = await fetch(`https://api.ip2whois.com/v2?key=${whois}&domain=${args[0]}`)
        } catch (err) {
            return message.reply({ content: "⚠️ The domain you provided is not supported" })
        }

        let dat = await response.json()
        let desc = `
\`\`\`
Domain Name: ${dat.domain}
Domain ID: ${dat.domain_id}\nStatus: ${dat.status}
Creation Date: ${dat.create_date}
Updated Date: ${dat.update_date}
Expiration Date: ${dat.expire_date}
Whois Server: ${dat.whois_server}

REGISTRAR
\tIANA ID: ${dat.registrar.iana_id}
\tName: ${dat.registrar.name}
\tURL: ${dat.registrar.url}

REGISTRANT
\tName: ${dat.registrant.name}
\tOrganization: ${dat.registrant.organization}
\tStreet Address: ${dat.registrant.street_address}
\tCity: ${dat.registrant.city}
\tRegion: ${dat.registrant.region}
\tZip Code: ${dat.registrant.zip_code}
\tCountry: ${dat.registrant.country}
\tPhone: ${dat.registrant.phone}
\tFax: ${dat.registrant.fax}
\tEmail: ${dat.registrant.email}

ADMIN
\tName: ${dat.admin.name}
\tOrganization: ${dat.admin.organization}
\tStreet Address: ${dat.admin.street_address}
\tCity: ${dat.admin.city}
\tRegion: ${dat.admin.region}
\tZip Code: ${dat.admin.zip_code}
\tCountry: ${dat.admin.country}
\tPhone: ${dat.admin.phone}
\tFax: ${dat.admin.fax}
\tEmail: ${dat.admin.email}

TECH
\tName: ${dat.tech.name}
\tOrganization: ${dat.tech.organization}
\tStreet Address: ${dat.tech.street_address}
\tCity: ${dat.tech.city}
\tRegion: ${dat.tech.region}
\tZip Code: ${dat.tech.zip_code}
\tCountry: ${dat.tech.country}
\tPhone: ${dat.tech.phone}
\tFax: ${dat.tech.fax}
\tEmail: ${dat.tech.email}
\`\`\`
        `
        let embed = new Embed()
            .setDescription(desc)
        message.reply({ embeds: [embed] })
    }
}