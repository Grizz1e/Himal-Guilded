const fetch = require('node-fetch')
const { serverId, premiumRoleId } = require('../config.json').bot

module.exports = class Util {
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    static getCat(n) {
        switch (n) {
            case 'admin':
                return ':male_police_officer: • Admin'
            case 'animals':
                return ':dog: • Animals'
            case 'anime':
                return ':cherry_blossom: • Anime'
            case 'bot':
                return ':robot_face: • Bot'
            case 'fun':
                return ':joy: • Fun';
            case 'games':
                return ':video_game: • Games'
            case 'misc':
                return ':game_die: • Misc'
            case 'moderation':
                return ':shield: • Moderation'
            case 'music':
                return ':guitar: • Music'
            case 'utility':
                return ':hammer_and_wrench: • Utility'
            default:
                return ':question: • Unknown Category';
        }
    }
    static checkRps(userChoice, botChoice) {
        if (userChoice === botChoice) return 2
        if ((userChoice === 'rock' && botChoice === 'paper') || (userChoice === 'paper' && botChoice === 'scissors') || (userChoice === 'scissors' && botChoice === 'rock')) return 0
        else return 1
    }


    static createMs(arr) {
        let i;
        let ok = []
        for (i = 0; i < arr.length; i++) {
            ok.push(arr[i].join(" "))
        }
        return " " + ok.join(" \n ")
            .replace(/ :zero: /g, "0️⃣")
            .replace(/ :one: /g, "1️⃣")
            .replace(/ :two: /g, "2️⃣")
            .replace(/ :three: /g, "3️⃣")
            .replace(/ :four: /g, "4️⃣")
            .replace(/ :five: /g, "5️⃣")
            .replace(/ :six: /g, "6️⃣")
            .replace(/ :seven: /g, "7️⃣")
            .replace(/ :eight: /g, "8️⃣")
            .replace(/ :bomb: /g, "💣")
    }

    static async guessWordle(str, id, key) {
        let dat, st;
        try {
            let options = {
                method: "POST",
                headers: {
                    "Accept": "*/*",
                    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "guess": str.toLowerCase(), "id": id, "key": key }),
            }
            dat = await fetch("https://word.digitalnook.net/api/v1/guess/", options)
            let res = await dat.json()
            st = res.map(x => `:${x.letter.toUpperCase()}_${x.state}:`).join("")
            return st
        } catch (err) {
            return null
        }
    }

    static async startWordle() {
        let dat = await axios.post('https://word.digitalnook.net/api/v1/start_game/', { "wordID": null })
        return dat.data
    }

    static nullWordle(j) {
        let str = ""
        for (let i = 0; i < j; i++) {
            str += ":null::null::null::null::null:\n"
        }
        return str;
    }
    static gitaslokid() {
        const slokcount = [47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78]
        const chapter = Math.floor(Math.random() * 17) + 1
        const slok = Math.floor(Math.random() * slokcount[chapter - 1]) + 1
        return `${chapter}/${slok}/`
    }
    static embedFieldTrimmer(str) {
        if (str.length <= 1024) {
            return [str]
        } else {
            let beginning = str.substr(0, 1024)
            let remaining = str.substr(1024, str.length)
            return [beginning].concat(this.embedFieldTrimmer(remaining))
        }
    }
    static filterURL(url) {
        return url.split('](')[0].replace('[', '')
    }

    static shuffleArray(array) {
        let currentIndex = array.length, randomIndex;

        while (currentIndex != 0) {

            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    static min2HrMin(n) {
        if (n < 60) return n + 'm'
        let num = n;
        let hours = (num / 60);
        let rhours = Math.floor(hours);
        let minutes = (hours - rhours) * 60;
        let rminutes = Math.round(minutes);
        return rhours + "h " + rminutes + 'm';
    }

    static sec2HrMinSec(n) {
        if (n < 60) return `00:${Math.round(n) < 10 ? `0${Math.round(n)}` : Math.round(n)}`
        const num = n;
        const hours = (num / (60 * 60))
        const rhours = Math.floor(hours)
        const minutes = (hours - rhours) * 60
        const rminutes = Math.floor(minutes)
        const seconds = (minutes - rminutes) * 60
        const rseconds = Math.round(seconds)
        let minSec = (rminutes < 10 ? `0${rminutes}` : `${rminutes}`) + ':' + (rseconds < 10 ? `0${rseconds}` : rseconds)
        if (rhours === 0) {
            return minSec
        } else {
            return (rhours < 10 ? `0${rhours}` : `${rhours}`) + ':\u200b' + minSec
        }
    }

    static async isPremiumUsr(usrId, client) {
        let server = await client.servers.fetch(serverId)
        let member = await server.members.fetch(usrId)
        if (!member) return false
        else if (member.roleIds.some(r => r == premiumRoleId)) return true
        else return false
    }
}