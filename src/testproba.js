const exec = require('./function.js')
const fs = require('fs')

const stats = {}

const iterations = 1000000

// On fait les tirages
for (let i = 0; i < iterations; i++) {
    const rollResult = exec.roll()
    const name = rollResult.result.name

    if (!stats[name]) {
        stats[name] = 0
    }
    stats[name]++
}

// Transformer en tableau pour pouvoir trier
const sortedStats = Object.entries(stats).sort((a, b) => b[1] - a[1])

// Écriture du fichier
let output = 'Proba :\n'
for (const [name, count] of sortedStats) {
    output += `${name} : ${count / iterations * 100}%\n`
}

fs.writeFileSync('test.txt', output)