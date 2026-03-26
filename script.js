let movies = [];
let series = [];
let all = [];

async function loadData() {
  const m = await fetch("movies.json");
  const s = await fetch("series.json");

  movies = await m.json();
  series = await s.json();

  all = [...movies, ...series];

  renderHero();
  renderCarousels(all);
}

function renderHero() {
  const hero = document.getElementById("hero");
  const item = all[0];

  hero.style.backgroundImage =
    `linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,1)), url(${item.banner})`;

  hero.innerHTML = `
    <div>
      <h1>${item.title}</h1>
      <p>⭐ ${item.rating}</p>
      <button onclick="play('${getVideo(item)}')">▶ Play</button>
    </div>
  `;
}

function getVideo(item){
  return item.videoId || item.episodes?.[0]?.videoId;
}

function renderCarousels(data) {
  const container = document.getElementById("carousels");
  container.innerHTML = "";

  const categories = ["Action","Drama","Sci-Fi","Adventure"];

  categories.forEach(cat => {
    const items = data.filter(i => i.genres.includes(cat));
    if(!items.length) return;

    container.innerHTML += `
      <div class="carousel">
        <h2>${cat}</h2>
        <div class="row">
          ${items.map(i => `
            <div class="card" onclick="play('${getVideo(i)}')">
              <img src="${i.poster}" loading="lazy">
            </div>
          `).join("")}
        </div>
      </div>
    `;
  });
}

/* PLAY */
function play(id){
  localStorage.setItem("videoId", id);
  window.location.href = "player.html";
}

/* SEARCH */
document.getElementById("search").addEventListener("input", e => {
  const term = e.target.value.toLowerCase();

  const filtered = all.filter(i =>
    i.title.toLowerCase().includes(term)
  );

  renderCarousels(filtered);
});

loadData();
