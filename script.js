const REFRESH_INTERVAL = 60; // seconds

let countdown = REFRESH_INTERVAL;

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
  
  countdown = REFRESH_INTERVAL; // reset countdown after each fetch
}

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

// Create and show countdown timer element
const body = document.querySelector('body');
const timerEl = document.createElement('div');
timerEl.style.textAlign = 'center';
timerEl.style.fontWeight = 'bold';
timerEl.style.marginBottom = '20px';
timerEl.style.fontSize = '1.2rem';
body.insertBefore(timerEl, body.firstChild);

function updateTimer() {
  timerEl.textContent = `Next update in: ${countdown} second${countdown !== 1 ? 's' : ''}`;
  countdown--;

  if (countdown < 0) countdown = REFRESH_INTERVAL;
}

// Initial load
loadStock();
updateTimer();

// Update stock every 60 seconds
setInterval(loadStock, REFRESH_INTERVAL * 1000);

// Update countdown timer every second
setInterval(updateTimer, 1000);
