module.exports = class Util {
    static renderPlayerStats(player) {
        let hpRemain = '▰'.repeat(Math.floor(player.hp / 10))
        let hpUsed = '▱'.repeat(10 - Math.floor(player.hp / 10))
        let hp = `**:hearts: HP:** ${hpRemain}${hpUsed} ${player.hp}%`
        let staminaRemain = '▰'.repeat(Math.floor(player.stamina / 10))
        let staminaUsed = '▱'.repeat(10 - Math.floor(player.stamina / 10))
        let stamina = `**:zap: Stamina:** ${staminaRemain}${staminaUsed} ${player.stamina}%`
        let otherInfo = `Punches: ${player.punches}, Kicks: ${player.kicks}, Heals: ${player.heals}`
        return `${hp}\n${stamina}\n${otherInfo}`
    }
    static fightMessage(choice) {
        let fleeArr = [
            'fled in fear',
            'took off running',
            'raced away',
            'made a quick exit',
            'fled the scene',
            'fled in terror',
            'ran for their lives'
        ]
        let howAttacked = [
            'landed',
            'threw',
            'delivered',
            'launched'
        ]
        if (choice === 'flee') return fleeArr[Math.floor(Math.random() * fleeArr.length)]
        else if (choice === 'punchKick') return howAttacked[Math.floor(Math.random() * howAttacked.length)]
    }
    static resolveNewStats(attacker, defender, attackType) {
        let toSend = {}
        if (attackType === 3) {
            if (attacker.heals <= 2) {
                attacker.hp += Math.floor(Math.random() * 6) + 5
                if (attacker.hp > 100) attacker.hp = 100
                toSend.healed = true
            }
            attacker.heals++
            attacker.stamina += Math.floor(Math.random() * 11) + 10
            if (attacker.stamina > 100) attacker.stamina = 100
            toSend.attacker = attacker
            toSend.defender = defender
            return toSend
        } else if (attackType === 2) {
            if (attacker.stamina < 20) return false
            attacker.kicks++
            defender.hp -= Math.floor(Math.random() * 11) + 10
            if (defender.hp < 0) defender.hp = 0
            attacker.stamina -= 20
            if (attacker.stamina < 0) attacker.stamina = 0
            return { attacker, defender }
        } else if (attackType === 1) {
            if (attacker.stamina < 10) return false
            attacker.punches++
            defender.hp -= Math.floor(Math.random() * 6) + 5
            if (defender.hp < 0) defender.hp = 0
            attacker.stamina -= 10
            if (attacker.stamina < 0) attacker.stamina = 0
            return { attacker, defender }
        }
    }
}