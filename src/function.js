const dotenv = require('dotenv');
const data = require("./rarity.json")
const db = require('./db.js');
const jwt = require("jsonwebtoken")

dotenv.config();

function roll(ip, token) {
  const fake = []
  let result = "Common";
  const timer = 10 * 500;
  let id = null;

  if (token) {
    const user = autenticateToken(token);
    userCheckDiscord(ip, user)
    id = user.id
  }
  else {
    userCheckIP(ip)
    id = ip
  }

  const datadb = db.getUserByConnectId(id)
    if ( Date.now() - timer < datadb.last_roll ) {
        return { error: "You must wait before rolling again" }
    }
    else {
        db.updateLastRoll(id)
    }

  // Generate 10 fake rarity rolls
  for (let i = 0; i < 9; i++) {
    let fakerarity = "Common";
    const random = Math.random();
    for (const rarity in data) {
      if (random < 1 / data[rarity].weight) {
        fakerarity = data[rarity].name;
      };
    }
    fake.push(fakerarity);
  }
  const random = Math.random();
    for (const rarity in data) {
      if (random < 1 / data[rarity].weight) {
        result = data[rarity];
      };
    }

    inventory = db.getInventoryByUserId(datadb.id)
    if (!inventory.some(item => item.item_name === result.name)) {
      db.addItemToInventory(datadb.id, result.name)
    }

  return { fake, result }
}

async function discordCallback(code) {
    const data = {
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
        scope: 'identify'
    }
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    try {
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: headers,
            body: new URLSearchParams(data)
        });

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        const userResponse = await fetch('https://discord.com/api/users/@me', {
            method: 'GET',
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const userData = await userResponse.json();
        const payload = { id: userData.id, username: userData.username }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" })
        return token;
    }
    catch (error) {
        console.error('Error during Discord OAuth2 process:', error);
        return null;
    }
}



function autenticateToken(token) {
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (err) {
        return null;
    }
}

function userCheckIP(ip) {
  const user = db.getUserByConnectId(ip);
  if (!user) {
    db.createUser(ip)
  }
}

function userCheckDiscord(ip, token) {
  const user = db.getUserByConnectId(token.id);
  if (!user) {
    const ipuser = db.getUserByConnectId(ip)
    if (ipuser) {
      db.updateConnectId(ip, token.id)
    }
    else {
      db.createUser(token.id)
    }
  }
  else {
  }
}

module.exports = {roll, discordCallback, autenticateToken};