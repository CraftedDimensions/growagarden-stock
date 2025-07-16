async function loadStock() {
  const res = await fetch('https://api.joshlei.com/v2/growagarden/stock');
  const data = await res.json();

  fillSection(data.seed_stock, 'seeds');
  fillSection(data.gear_stock, 'gear');
  fillSection(data.egg_stock, 'eggs');
  fillSection(data.cosmetic_stock, 'cosmetics');
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

loadStock();
