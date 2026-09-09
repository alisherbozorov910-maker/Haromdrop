const caseItems = {
  iron: [
    { name: "Yog'och Pichoq", price: 5 },
    { name: "Temir Kalit", price: 8 },
    { name: "10 Coin", price: 10 },
    { name: "Eski Soat", price: 12 }
  ],
  gold: [
    { name: "Oltin Zanjir", price: 20 },
    { name: "Amonat Tangalari", price: 25 },
    { name: "50 Coin", price: 50 },
    { name: "Oltin Qalam", price: 18 }
  ],
  diamond: [
    { name: "Almos Uzuk", price: 60 },
    { name: "Lexus Kaliti", price: 150 },
    { name: "200 Coin", price: 200 },
    { name: "Toj", price: 100 }
  ]
};

let currentUser = null;

// Tizimga kirish holatini tekshirish
window.onload = function() {
  const savedUser = localStorage.getItem("active_session");
  if (savedUser && localStorage.getItem("user_" + savedUser)) {
    currentUser = savedUser;
    showGameScreen();
  }
};

function register() {
  const user = document.getElementById("username-input").value.trim().toLowerCase();
  const pass = document.getElementById("password-input").value.trim();
  const msg = document.getElementById("auth-msg");

  if (!user || !pass) {
    msg.innerText = "Login va parol kiriting!";
    return;
  }

  if (localStorage.getItem("user_" + user)) {
    msg.innerText = "Bu login band!";
    return;
  }

  const userData = { password: pass, balance: 100, inventory: [] };
  localStorage.setItem("user_" + user, JSON.stringify(userData));
  msg.style.color = "#00e676";
  msg.innerText = "Muvaffaqiyatli ro'yxatdan o'tdingiz!";
}

function login() {
  const user = document.getElementById("username-input").value.trim().toLowerCase();
  const pass = document.getElementById("password-input").value.trim();
  const msg = document.getElementById("auth-msg");

  const savedData = localStorage.getItem("user_" + user);
  if (!savedData) {
    msg.innerText = "Foydalanuvchi topilmadi!";
    return;
  }

  const userData = JSON.parse(savedData);
  if (userData.password !== pass) {
    msg.innerText = "Parol noto'g'ri!";
    return;
  }

  currentUser = user;
  localStorage.setItem("active_session", user);
  showGameScreen();
}

function logout() {
  localStorage.removeItem("active_session");
  currentUser = null;
  document.getElementById("game-screen").classList.add("hidden");
  document.getElementById("auth-screen").classList.remove("hidden");
  toggleMenu(true);
}

function showGameScreen() {
  document.getElementById("auth-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.remove("hidden");
  updateUI();
}

function updateUI() {
  const userData = JSON.parse(localStorage.getItem("user_" + currentUser));
  document.getElementById("user-display").innerText = currentUser;
  document.getElementById("balance-display").innerText = userData.balance;
  document.getElementById("profile-name").innerText = currentUser;
  document.getElementById("profile-balance").innerText = userData.balance;
  renderInventory(userData.inventory);
}

// Menyu
function toggleMenu(forceClose = false) {
  const menu = document.getElementById("side-menu");
  if (forceClose) {
    menu.classList.add("hidden");
  } else {
    menu.classList.toggle("hidden");
  }
}

function openTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(el => el.classList.add("hidden"));
  document.getElementById(tabId).classList.remove("hidden");
  toggleMenu(true);
}

// Ruletka va Case Ochish
let isSpinning = false;

function openCase(type, price) {
  if (isSpinning) return;

  const userData = JSON.parse(localStorage.getItem("user_" + currentUser));
  if (userData.balance < price) {
    alert("Coin yetarli emas!");
    return;
  }

  isSpinning = true;
  userData.balance -= price;
  localStorage.setItem("user_" + currentUser, JSON.stringify(userData));
  updateUI();

  const rouletteSection = document.getElementById("roulette-section");
  const roulette = document.getElementById("roulette");
  rouletteSection.classList.remove("hidden");

  const items = caseItems[type];
  const list = [];
  
  // 60 ta element shakllantirish
  for (let i = 0; i < 60; i++) {
    const rand = items[Math.floor(Math.random() * items.length)];
    list.push(rand);
  }

  // Yutuq 50-element bo'ladi
  const winIndex = 50;
  const wonItem = list[winIndex];

  roulette.innerHTML = "";
  list.forEach(item => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerText = item.name;
    roulette.appendChild(card);
  });

  // Animatsiyani nolga tushirish
  roulette.style.transition = "none";
  roulette.style.transform = "translateX(0px)";

  setTimeout(() => {
    // Karta kengligi: 100px. Qizil chiziq markazda turishi uchun hisob:
    const cardWidth = 100;
    const wrapperWidth = rouletteSection.querySelector(".roulette-wrapper").offsetWidth;
    const targetTranslate = (winIndex * cardWidth) - (wrapperWidth / 2) + (cardWidth / 2);

    roulette.style.transition = "transform 4s cubic-bezier(0.15, 0.9, 0.2, 1)";
    roulette.style.transform = `translateX(-${targetTranslate}px)`;

    setTimeout(() => {
      // Yutuqni saqlash va ko'rsatish
      userData.inventory.push(wonItem);
      localStorage.setItem("user_" + currentUser, JSON.stringify(userData));
      updateUI();

      document.getElementById("win-item-name").innerText = `${wonItem.name} (${wonItem.price} coin)`;
      document.getElementById("result-modal").style.display = "flex";
      isSpinning = false;
    }, 4000);
  }, 50);
}

function closeModal() {
  document.getElementById("result-modal").style.display = "none";
}

// Inventar va Sotish
function renderInventory(inv) {
  const container = document.getElementById("inventory-grid");
  container.innerHTML = "";

  if (inv.length === 0) {
    container.innerHTML = "<p style='grid-column: 1/-1; color: #777;'>Inventaringiz bo'sh</p>";
    return;
  }

  inv.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "inv-card";
    card.innerHTML = `
      <span><b>${item.name}</b></span>
      <span style="color:#ffd700">${item.price} coin</span>
      <button onclick="sellItem(${index})">Sotish</button>
    `;
    container.appendChild(card);
  });
}

function sellItem(index) {
  const userData = JSON.parse(localStorage.getItem("user_" + currentUser));
  const soldItem = userData.inventory.splice(index, 1)[0];
  userData.balance += soldItem.price;

  localStorage.setItem("user_" + currentUser, JSON.stringify(userData));
  updateUI();
}
