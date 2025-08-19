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
    }, 5000);
  })
    .catch(error => console.error('Error:', error))
}