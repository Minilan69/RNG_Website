const Database = require('better-sqlite3')
const db = new Database('src/db/user.db')

function createDB() {
  // Users
  db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    connect_id TEXT,
    created_at INTEGER,
    last_roll INTEGER DEFAULT 10000000
  )
  `).run()

  // Inventory
  db.prepare(`
  CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    item_name TEXT,
    obtained_at INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )
  `).run()

  console.log("Data Base Launch")
}

function createUser(id) {
  const insert = db.prepare('INSERT INTO users (connect_id, created_at) VALUES (?, ?)')
  insert.run(id, Date.now())
}

function updateLastRoll(id) {
  const update = db.prepare('UPDATE users SET last_roll = ? WHERE connect_id = ?')
  update.run(Date.now(),id)
}

function updateConnectId(oldId, newId) {
  const update = db.prepare('UPDATE users SET connect_id = ? WHERE connect_id = ?')
  update.run(newId, oldId)
}

function getUserByConnectId(id) {
  const select = db.prepare('SELECT * FROM users WHERE connect_id = ?')
  return select.get(id)
}

function getInventoryByUserId(userId) {
  const select = db.prepare('SELECT * FROM inventory WHERE user_id = ?')
  return select.all(userId)
}

function addItemToInventory(userId, itemName) {
  const insert = db.prepare('INSERT INTO inventory (user_id, item_name, obtained_at) VALUES (?, ?, ?)')
  insert.run(userId, itemName, Date.now())
}


module.exports = { createDB, createUser, updateLastRoll, updateConnectId, getUserByConnectId, getInventoryByUserId, addItemToInventory };