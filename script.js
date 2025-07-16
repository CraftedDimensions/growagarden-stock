const REFRESH_INTERVAL = 60; // seconds
const timerEl = document.getElementById('timer');

// Fetch and display stock data
async function loadStock() {
  try {
    const res = await fetch('https://api.joshlei.com/v2/growagarden/stock');
    const data = await res.json();

    clearContainers(['seeds', 'gear', 'eggs', 'cosmetics']);

    fillSection(data.seed_stock, 'seeds');
    fillSection(data.gear_stock, 'gear');
    fillSection(data.egg_stock, 'eggs');
    fillSection(data.cosmetic_stock, 'cosmetics');
  } catch (e) {
    console.error('Failed to load stock:', e);
  }
}

function clearContainers(ids) {
  ids.forEach(id => {
    const container = document.getElementById(id);
    if (container) container.innerHTML = '';
  });
}

function fillSection(items, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';

    const start = new Date(item.Date_Start).toLocaleTimeString();
    const end = new Date(item.Date_End).toLocaleTimeString();

    card.innerHTML = `
      <img src="${item.icon}" alt="${item.display_name}" />
      <h3>${item.display_name}</h3>
      <p>Quantity: ${item.quantity}</p>
      <p>${start} - ${end}</p>
    `;

    container.appendChild(card);
  });
}

// Fetch and display active weather data
async function loadWeather() {
  const container = document.getElementById('weather-info');
  try {
    const res = await fetch('https://api.joshlei.com/v2/growagarden/weather');
    const data = await res.json();

    container.innerHTML = '';

    const activeWeathers = data.weather.filter(w => w.active);

    if (activeWeathers.length === 0) {
      container.textContent = 'No active weather events currently.';
      return;
    }

    activeWeathers.forEach(weather => {
      const card = document.createElement('div');
      card.className = 'card';

      card.innerHTML = `
        <img src="${weather.icon}" alt="${weather.weather_name}" />
        <h3>${weather.weather_name}</h3>
        <p>Duration: ${weather.duration} seconds</p>
      `;

      container.appendChild(card);
    });
  } catch (e) {
    container.textContent = 'Failed to load weather data.';
    console.error('Weather API error:', e);
  }
}

// Calculate seconds until next full interval (e.g. next full minute)
function getSecondsUntilNextRefresh() {
  const now = Math.floor(Date.now() / 1000);
  return REFRESH_INTERVAL - (now % REFRESH_INTERVAL);
}

let countdown = getSecondsUntilNextRefresh();

function updateTimer() {
  timerEl.textContent = `Next update in: ${countdown} second${countdown !== 1 ? 's' : ''}`;
  countdown--;
  if (countdown < 0) {
    loadAll();
    countdown = REFRESH_INTERVAL;
  }
}

// Load both stock and weather
async function loadAll() {
  await loadStock();
  await loadWeather();
}

// Initial load and start timer
loadAll();
updateTimer();
setInterval(updateTimer, 1000);
