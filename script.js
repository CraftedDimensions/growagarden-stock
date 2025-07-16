const REFRESH_INTERVAL = 60; // seconds

let timerEl = document.createElement('div');
timerEl.style.textAlign = 'center';
timerEl.style.fontWeight = 'bold';
timerEl.style.marginBottom = '20px';
timerEl.style.fontSize = '1.2rem';
document.body.insertBefore(timerEl, document.body.firstChild);

async function loadStock() {
  const res = await fetch('https://api.joshlei.com/v2/growagarden/stock');
  const data = await res.json();

  ['seeds', 'gear', 'eggs', 'cosmetics'].forEach(id => {
    document.getElementById(id).innerHTML = '';
  });

  fillSection(data.seed_stock, 'seeds');
  fillSection(data.gear_stock, 'gear');
  fillSection(data.egg_stock, 'eggs');
  fillSection(data.cosmetic_stock, 'cosmetics');
}

// Fill function stays the same as before
function fillSection(items, containerId) {
  const container = document.getElementById(containerId);
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';

    const start = new Date(item.Date_Start).toLocaleTimeString();
    const end = new Date(item.Date_End).toLocaleTimeString();

    card.innerHTML = `
      <img src="${item.icon}" alt="${item.display_name}">
      <h3>${item.display_name}</h3>
      <p>Quantity: ${item.quantity}</p>
      <p>${start} - ${end}</p>
    `;

    container.appendChild(card);
  });
}

// Calculate time until next 60-second interval
function getSecondsUntilNextRefresh() {
  const now = Math.floor(Date.now() / 1000);
  return REFRESH_INTERVAL - (now % REFRESH_INTERVAL);
}

let countdown = getSecondsUntilNextRefresh();

function updateTimer() {
  timerEl.textContent = `Next update in: ${countdown} second${countdown !== 1 ? 's' : ''}`;
  countdown--;
  if (countdown < 0) {
    loadStock();        // Refresh stock when countdown hits zero
    countdown = REFRESH_INTERVAL;
  }
}

// Initial load
loadStock();
updateTimer();

// Update timer every second
setInterval(updateTimer, 1000);
