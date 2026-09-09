// Case tarkibidagi itemlar
const caseItems = {
  iron: [
    { name: "Yog'och Pichoq" },
    { name: "Temir Kalit" },
    { name: "10 Coin" },
    { name: "Eski Soat" }
  ],
  gold: [
    { name: "Oltin Zanjir" },
    { name: "Amonat Tangalari" },
    { name: "50 Coin" },
    { name: "Oltin Qalam" }
  ],
  diamond: [
    { name: "Almos Uzuk" },
    { name: "Lexus Kaliti" },
    { name: "200 Coin" },
    { name: "Toj" }
  ]
};

let currentUser = null;

// Ro'yxatdan o'tish
function register() {
  const user = document.getElementById("username-input").value.trim();
  const pass = document.getElementById("password-input").value.trim();
  const msg = document.getElementById("auth-msg");

  if (!user || !pass) {
    msg.innerText = "Barcha maydonlarni to'ldiring!";
    return;
  }

  if (localStorage.getItem("user_" + user)) {
    msg.innerText = "Bu login allaqachon mavjud!";
    return;
  }

  const userData = { password: pass, balance: 100 };
  localStorage.setItem("user_" + user, JSON.stringify(userData));
  msg.style.color = "#00e676";
  msg.innerText = "Hisob ochildi! Endi 'Kirish' tugmasini bosing.";
}

// Kirish
function login() {
  const user = document.getElementById("username-input").value.trim();
  const pass = document.getElementById("password-input").value.trim();
  const msg = document.getElementById("auth-msg");

  const savedData = localStorage.getItem("user_" + user);

  if (!savedData) {
    msg.innerText = "Bunday foydalanuvchi topilmadi!";
    return;
  }

  const userData = JSON.parse(savedData);

  if (userData.password !== pass) {
    msg.innerText = "Parol noto'g'ri!";
    return;
  }

  currentUser = user;
  updateUI();
  document.getElementById("auth-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.remove("hidden");
}

// Chiqish
function logout() {
  currentUser = null;
  document.getElementById("game-screen").classList.add("hidden");
  document.getElementById("auth-screen").classList.remove("hidden");
}

// Balansni yangilash
function updateUI() {
  const userData = JSON.parse(localStorage.getItem("user_" + currentUser));
  document.getElementById("user-display").innerText = currentUser;
  document.getElementById("balance-display").innerText = userData.balance;
}

// Case ochish
function openCase(type, price) {
  const userData = JSON.parse(localStorage.getItem("user_" + currentUser));

  if (userData.balance < price) {
    alert("Balansingizda yetarli coin yo'q!");
    return;
  }

  // Coin yechish
  userData.balance -= price;
  localStorage.setItem("user_" + currentUser, JSON.stringify(userData));
  updateUI();

  // Ruletkani ko'rsatish
  const rouletteSection = document.getElementById("roulette-section");
  const roulette = document.getElementById("roulette");
  rouletteSection.classList.remove("hidden");

  const items = caseItems[type];
  roulette.innerHTML = "";

  for (let i = 0; i < 60; i++) {
    const rand = items[Math.floor(Math.random() * items.length)];
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerText = rand.name;
    roulette.appendChild(card);
  }

  // Aylanish animatsiyasi
  roulette.style.transition = "none";
  roulette.style.transform = "translateX(0px)";

  setTimeout(() => {
    const winningIndex = 45;
    const itemWidth = 100;
    const targetTranslate = (winningIndex * itemWidth) - 200;

    roulette.style.transition = "transform 4s cubic-bezier(0.1, 1, 0.1, 1)";
    roulette.style.transform = `translateX(-${targetTranslate}px)`;

    setTimeout(() => {
      const wonItem = roulette.children[winningIndex].innerText;
      document.getElementById("win-item-name").innerText = wonItem;
      document.getElementById("result-modal").style.display = "flex";
    }, 4000);
  }, 50);
}

function closeModal() {
  document.getElementById("result-modal").style.display = "none";
}

