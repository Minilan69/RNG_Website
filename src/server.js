const dotenv = require('dotenv');
const express = require('express')
const app = express()
const path = require('path')
const db = require('./db.js');
const exec = require('./function.js');
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")

dotenv.config();
db.createDB();

PORT = process.env.PORT || 7000;
DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;
SECUREHTTPS = process.env.SECUREHTTPS === 'true';

app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(cookieParser())

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

app.get('/roll', (req, res) => {
  res.json(exec.roll(req.ip, req.cookies.auth_token))
})

app.get("/login", (req, res) => {
  res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${DISCORD_REDIRECT_URI}&response_type=code&scope=identify`)
})

app.get('/callback', async (req, res) => {
  const code = req.query.code;
  if (code) {
    const callback = await exec.discordCallback(code)
  res.cookie("auth_token", callback , {
    httpOnly: true,
    secure: SECUREHTTPS,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000
  })
  }
  res.redirect('/');
})

app.get('/me', (req, res) => {
  const token = req.cookies.auth_token
  if (!token) return res.json({ loggedIn: false })
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET)
    res.json({ loggedIn: true, username: user.username })
  } catch (err) {
    res.json({ loggedIn: false })
  }
})

app.post("/logout", (req, res) => {
  res.clearCookie("auth_token")
  res.json({ success: true })
})

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`)
})