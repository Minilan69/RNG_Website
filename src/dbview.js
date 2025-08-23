const Database = require('better-sqlite3')
const db = new Database('src/db/user.db')

const select = db.prepare('SELECT * FROM inventory WHERE user_id = ?')
console.log(`Fetched inventory for user_id: ${1}`)
console.log(select.all(1))
