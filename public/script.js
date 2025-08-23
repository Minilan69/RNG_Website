function animateroll() {
    let element = document.getElementById("rolling");
    element.classList.remove("animate-roll")
    void element.offsetWidth
    element.classList.add("animate-roll")
}

function fakeroll(fake,i) {
  let n = fake.length;
  let delay = 500;
  if (i >= n) return;

  document.getElementById('rolling').innerText = fake[i];
  document.getElementById('rolling').className = '';
  document.getElementById('rolling').classList.add(fake[i].toLowerCase());
  animateroll();

  setTimeout(() => fakeroll(fake, i + 1), delay);
}

function roll() {
    fetch('/roll')
  .then(response => response.json())
  .then(data => {
    console.log(data.result.name);
    console.log(data.fake);
    fakeroll(data.fake, 0);
    setTimeout(() => {
        document.getElementById('rolling').innerText = data.result.name;
        document.getElementById('rolling').className = '';
        document.getElementById('rolling').classList.add(data.result.name.toLowerCase());
        animateroll();
        document.getElementById('css').setAttribute('href', 'css/'+ data.result.css);
    }, 4500);
  })
    .catch(error => console.error('Error:', error))
}

async function discordButton() {
  const response = await fetch('/me');
  const data = await response.json();
  const button = document.getElementById('discord_button');
  console.log('Fetched /me:', data);
  if (data.loggedIn) {
    button.innerText = 'Logout of ' + data.username;
    button.onclick = async () => {
      await fetch('/logout', { method: 'POST' });
      discordButton();
    }
  } else {
    button.innerText = 'Login with Discord';
    button.onclick = () => {
      window.location.href = '/login';
  }
}
}

discordButton();