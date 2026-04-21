const WA_NUMBER = "524771234567";

// ===== PRODUCTS DATA =====
const products = [
  {
    id: 1,
    name: "Palomitas Takis Fuego",
    emoji: "🔥",
    desc: "Picositas y adictivas",
    price: 80,
    bg: "bg-fuego",
  },
  {
    id: 2,
    name: "Palomitas Caramelo",
    emoji: "🍯",
    desc: "Dulces y crujientes",
    price: 80,
    bg: "bg-caramelo",
  },
  {
    id: 3,
    name: "Palomitas Queso",
    emoji: "🧀",
    desc: "Sabrosas y cremosas",
    price: 80,
    bg: "bg-queso",
  },
  {
    id: 4,
    name: "Palomitas Chocolate",
    emoji: "🍫",
    desc: "Irresistible mezcla",
    price: 85,
    bg: "bg-chocolate",
  },
  {
    id: 5,
    name: "Palomitas Ranch",
    emoji: "🥬",
    desc: "Sabor intenso y fresco",
    price: 80,
    bg: "bg-ranch",
  },
  {
    id: 6,
    name: "Palomitas Chile Limón",
    emoji: "🍋",
    desc: "El clásico mexicano",
    price: 80,
    bg: "bg-chile",
  },
  {
    id: 7,
    name: "Palomitas Mantequilla",
    emoji: "🧈",
    desc: "El original favorito",
    price: 75,
    bg: "bg-mantequilla",
  },
  {
    id: 8,
    name: "Mix 3 Sabores",
    emoji: "🍿",
    desc: "Combina tus 3 fav",
    price: 220,
    bg: "bg-mix",
  },
];

// ===== STATE =====
let qtys = {}; // { productId: qty }
let cart = {}; // { productId: { product, qty } }

// Load cart from localStorage
try {
  const saved = localStorage.getItem("lexpop_cart");
  if (saved) cart = JSON.parse(saved);
} catch (e) {}

// ===== RENDER PRODUCTS =====
function renderProducts() {
  const grid = document.getElementById("productsGrid");
  grid.innerHTML = products
    .map((p) => {
      const inCart = cart[p.id]?.qty || 0;
      return `
      <div class="product-card" id="card-${p.id}">
        <div class="product-img ${p.bg}">${p.emoji}</div>
        <div class="product-body">
          <div class="product-name">${p.name}</div>
          <div class="product-desc">${p.desc}</div>
          <div class="product-price">$${p.price}</div>
          <div class="qty-controls">
            <button class="qty-btn" onclick="changeQty(${p.id},-1)" aria-label="Reducir">−</button>
            <span class="qty-val" id="qty-${p.id}">${qtys[p.id] || 1}</span>
            <button class="qty-btn" onclick="changeQty(${p.id},1)" aria-label="Aumentar">+</button>
          </div>
          <button class="btn-add ${inCart > 0 ? "added" : ""}" onclick="addToCart(${p.id})" id="addbtn-${p.id}">
            ${inCart > 0 ? "✅ En carrito (" + inCart + ")" : "🛒 Agregar al carrito"}
          </button>
        </div>
      </div>`;
    })
    .join("");
}

function changeQty(id, delta) {
  qtys[id] = Math.max(1, (qtys[id] || 1) + delta);
  document.getElementById("qty-" + id).textContent = qtys[id];
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  const qty = qtys[id] || 1;
  if (cart[id]) {
    cart[id].qty += qty;
  } else {
    cart[id] = { product, qty };
  }
  saveCart();
  updateCartUI();
  updateAddBtn(id);
  showToast("✅ " + product.name + " x" + qty + " agregado");
  pulseBadge();
}

function updateAddBtn(id) {
  showAddedMessage();
  const btn = document.getElementById("addbtn-" + id);
  if (!btn) return;
  const inCart = cart[id]?.qty || 0;
  btn.className = "btn-add " + (inCart > 0 ? "added" : "");
  btn.textContent =
    inCart > 0 ? "✅ En carrito (" + inCart + ")" : "🛒 Agregar al carrito";
}

// ===== CART =====
function saveCart() {
  try {
    localStorage.setItem("lexpop_cart", JSON.stringify(cart));
  } catch (e) {}
}

function getCartCount() {
  return Object.values(cart).reduce((s, i) => s + i.qty, 0);
}

function getCartTotal() {
  return Object.values(cart).reduce((s, i) => s + i.product.price * i.qty, 0);
}

function updateCartUI() {
  const count = getCartCount();
  const total = getCartTotal();
  document.getElementById("cartBadge").textContent = count;
  document.getElementById("cartTotal").textContent = "$" + total;
  const btn = document.getElementById("checkoutBtn");
  btn.disabled = count === 0;
  renderCartItems();
}

function renderCartItems() {
  const container = document.getElementById("cartItems");
  const items = Object.values(cart).filter((i) => i.qty > 0);
  if (items.length === 0) {
    container.innerHTML = `<div class="cart-empty"><div class="big-emoji">🍿</div><p>Tu carrito está vacío</p></div>`;
    return;
  }
  container.innerHTML = items
    .map(
      ({ product: p, qty }) => `
      <div class="cart-item">
        <div class="cart-item-emoji">${p.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-price">$${p.price} c/u · Total: $${p.price * qty}</div>
        </div>
        <div class="cart-item-controls">
          <button class="ci-btn" onclick="updateCartQty(${p.id},-1)">−</button>
          <span class="ci-qty">${qty}</span>
          <button class="ci-btn" onclick="updateCartQty(${p.id},1)">+</button>
        </div>
      </div>
    `,
    )
    .join("");
}

function updateCartQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  saveCart();
  updateCartUI();
  updateAddBtn(id);
}

function openCart() {
  document.getElementById("cartOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
  renderCartItems();
}

function closeCart() {
  document.getElementById("cartOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById("cartOverlay")) closeCart();
}

// ===== ORDER MODAL =====
function openOrderModal() {
  closeCart();
  document.getElementById("orderModal").classList.add("open");
  document.body.style.overflow = "hidden";
  setTimeout(() => document.getElementById("orderName").focus(), 350);
}

function closeOrderModal() {
  document.getElementById("orderModal").classList.remove("open");
  document.body.style.overflow = "";
}

// ===== SEND TO WHATSAPP =====
function sendWhatsApp() {
  const name = document.getElementById("orderName").value.trim();
  const address = document.getElementById("orderAddress").value.trim();
  const refs = document.getElementById("orderRef").value.trim();

  const nameInput = document.getElementById("orderName");
  const addressInput = document.getElementById("orderAddress");

  let valid = true;

  // Validación nombre
  if (!name) {
    nameInput.style.border = "2px solid red";
    nameInput.placeholder = "Ingresa tu nombre por favor";
    nameInput.focus();
    valid = false;
  } else {
    nameInput.style.border = "";
  }

  // Validación dirección
  if (!address) {
    addressInput.style.border = "2px solid red";
    addressInput.placeholder = "Ingresa tu dirección por favor";
    if (valid) addressInput.focus();
    valid = false;
  } else {
    addressInput.style.border = "";
  }

  function showAddedMessage() {
    const msg = document.createElement("div");
    msg.innerText = "Agregado al carrito 🛒";
    msg.style.position = "fixed";
    msg.style.bottom = "20px";
    msg.style.left = "50%";
    msg.style.transform = "translateX(-50%)";
    msg.style.background = "black";
    msg.style.color = "white";
    msg.style.padding = "10px 20px";
    msg.style.borderRadius = "8px";
    document.body.appendChild(msg);

    setTimeout(() => msg.remove(), 1500);
  }

  // Si algo está mal, no continúa
  if (!valid) return;

  const items = Object.values(cart).filter((i) => i.qty > 0);
  if (items.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  const itemLines = items
    .map(({ product: p, qty }) => `• ${p.name} x${qty} - $${p.price * qty}`)
    .join("\n");

  const total = getCartTotal();

  let msg = `🍿 *Hola, quiero hacer el siguiente pedido en Lex Pop:*\n\n`;
  msg += itemLines + "\n\n";
  msg += `💰 *Total: $${total}*\n\n`;
  msg += `👤 *Nombre:* ${name}\n`;
  msg += `📍 *Dirección:* ${address}`;
  if (refs) msg += `\n📌 *Referencias:* ${refs}`;

  const encoded = encodeURIComponent(msg);
  window.open(`https://wa.me/${WA_NUMBER}?text=${encoded}`, "_blank");

  // Clear cart after send
  cart = {};
  saveCart();
  updateCartUI();
  renderProducts();
  closeOrderModal();
  showToast("🚀 ¡Pedido enviado! Pronto te contactamos");
}

// ===== UTILS =====
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}

function pulseBadge() {
  const badge = document.getElementById("cartBadge");
  badge.classList.remove("pop");
  void badge.offsetWidth;
  badge.classList.add("pop");
}

// Close modal on bg click
document.getElementById("orderModal").addEventListener("click", function (e) {
  if (e.target === this) closeOrderModal();
});

// ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeCart();
    closeOrderModal();
  }
});

// ===== INIT =====
renderProducts();
updateCartUI();
