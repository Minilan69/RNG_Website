const dotenv = require('dotenv');
const express = require('express')
const app = express()
const path = require('path')
const data = require("./rarity.json")

dotenv.config();
PORT = process.env.PORT || 7000;

app.use(express.static(path.join(__dirname, '..', 'public')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

app.get('/roll', (req, res) => {
  const fake = []
  let result = "Common";

  // Generate 10 fake rarity rolls
  for (let i = 0; i < 10; i++) {
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

  
  res.json({ fake, result })
})

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`)
})