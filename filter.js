document.addEventListener('DOMContentLoaded', () => {
    const brandFilters = document.querySelectorAll('.brand-filter');
    const typeFilters = document.querySelectorAll('.type-filter');
    const products = document.querySelectorAll('.card');

    function filter() {
        const activeBrands = Array.from(brandFilters).filter(i => i.checked).map(i => i.value);
        const activeTypes = Array.from(typeFilters).filter(i => i.checked).map(i => i.value);

        products.forEach(p => {
            const bMatch = activeBrands.length === 0 || activeBrands.includes(p.dataset.brand);
            const tMatch = activeTypes.length === 0 || activeTypes.includes(p.dataset.type);
            
            p.style.display = (bMatch && tMatch) ? 'block' : 'none';
            if (bMatch && tMatch) p.style.animation = 'fadeInUp 0.5s ease';
        });
    }

    [...brandFilters, ...typeFilters].forEach(el => el.addEventListener('change', filter));
});







/* ======================
   GLOBAL CART (ONE TIME)
====================== */
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartCount   = document.getElementById("cartCount");
const cartPanel   = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems   = document.getElementById("cartItems");
const checkoutBtn = document.getElementById("checkoutBtn");

const modal       = document.getElementById("customerModal");
const confirmBtn  = document.getElementById("confirmOrderBtn");

const SHEET_URL   = "https://script.google.com/macros/s/AKfycbxY3ZW-Gc3KX9vEsTBBsi32imjMNJHhVLmdk4NQpbTHj3N0zayPPPIXzEtQRmD1SyFC/exec";
const WA_NUMBER   = "918936969575";

/* ======================
   HELPERS
====================== */
function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
  cartCount.innerText = cart.reduce((s,i)=>s+i.qty,0);
}

function openCart(){
  cartPanel.classList.add("open");
  cartOverlay.classList.add("show");
  renderCart();
}

function closeCart(){
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("show");
}

function generateOrderId(){
  return "ORD-" + Date.now();
}

/* ======================
   ADD TO CART
====================== */
document.querySelectorAll(".add-to-cart-btn, .shop-now-btn").forEach(btn=>{
  btn.onclick = e=>{
    e.preventDefault();

    const card = btn.closest(".card");
    const product = card.querySelector(".card-title").innerText;

    let item = cart.find(i=>i.product===product);

    if(item) item.qty++;
    else{
      cart.push({
        product,
        brand: card.dataset.brand,
        type: card.querySelector(".card-type").innerText,
        image: card.querySelector("img").src,
        qty: 1
      });
    }

    saveCart();
    openCart();
  };
});

/* ======================
   CART UI
====================== */
document.getElementById("cartIcon").onclick = openCart;
cartOverlay.onclick = closeCart;
document.getElementById("closeCart").onclick = closeCart;

function renderCart(){
  cartItems.innerHTML = "";

  cart.forEach((item,i)=>{
    cartItems.innerHTML += `
      <div class="cart-item">
        <strong>${item.product}</strong><br>
        ${item.brand} • ${item.type}

        <div class="cart-actions">
          <button onclick="changeQty(${i},-1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${i},1)">+</button>
          <button onclick="removeItem(${i})">✕</button>
        </div>
      </div>
    `;
  });
}

window.changeQty = (i,d)=>{
  cart[i].qty += d;
  if(cart[i].qty<=0) cart.splice(i,1);
  saveCart();
  renderCart();
};

window.removeItem = i=>{
  cart.splice(i,1);
  saveCart();
  renderCart();
};

/* ======================
   CHECKOUT
====================== */
checkoutBtn.onclick = ()=>{
  if(!cart.length) return alert("Cart empty");
  modal.style.display="flex";
};

confirmBtn.onclick = ()=>{
  const name = custName.value.trim();
  const phone = custPhone.value.trim();
  const address = custAddress.value.trim();
  if(!name||!phone||!address) return alert("Fill all details");

  const orderId = generateOrderId();

  let itemsText="";
  cart.forEach((i,n)=>{
    itemsText += `${n+1}. ${i.product}
Brand: ${i.brand}
Type: ${i.type}
Qty: ${i.qty}\n\n`;
  });

  fetch(SHEET_URL,{
    method:"POST",
    headers:{ "Content-Type":"text/plain;charset=utf-8" },
    body:JSON.stringify({
      action:"create",
      orderId,
      name,
      phone,
      address,
      products: itemsText
    })
  });

  // ⚠️ NO IMAGE LINK → NO PREVIEW
  window.open(
    `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
      `ORDER ID: ${orderId}\n\n${itemsText}`
    )}`,
    "_blank"
  );

  cart=[];
  localStorage.removeItem("cart");
  saveCart();
  modal.style.display="none";
  closeCart();
};

saveCart();
renderCart();
