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








document.addEventListener("DOMContentLoaded", () => {

  const phoneNumber = "918936969575";
  const sheetURL = "https://script.google.com/macros/s/AKfycbxscmDhD47oCUcUq2vBAPfzXiQS5NrH1XL8ViTYOuS0HlqFAEwZYu7pnuUlRz6jCu-Q/exec";

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartCount = document.getElementById("cartCount");
  const cartPanel = document.getElementById("cartPanel");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartItems = document.getElementById("cartItems");
  const cartIcon = document.getElementById("cartIcon");
  const closeCartBtn = document.getElementById("closeCart");
  const checkoutBtn = document.getElementById("checkoutBtn");

  /* -------------------------
     UPDATE CART COUNT
  --------------------------*/
  function updateCartCount() {
    cartCount.innerText = cart.reduce((sum, i) => sum + i.qty, 0);
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  updateCartCount();

  /* -------------------------
     ADD TO CART
  --------------------------*/
  document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();

      const card = btn.closest(".card");
      const product = card.querySelector(".card-title").innerText.trim();

      const existing = cart.find(i => i.product === product);

      if (existing) {
        existing.qty++;
      } else {
        cart.push({
          brand: card.dataset.brand,
          product,
          type: card.querySelector(".card-type").innerText.trim(),
          image: card.querySelector("img").src,
          qty: 1
        });
      }

      updateCartCount();
    });
  });

  /* -------------------------
     OPEN / CLOSE CART
  --------------------------*/
  cartIcon.onclick = () => {
    cartPanel.classList.add("open");
    cartOverlay.classList.add("show");
    renderCart();
  };

  closeCartBtn.onclick = closeCart;
  cartOverlay.onclick = closeCart;

  function closeCart() {
    cartPanel.classList.remove("open");
    cartOverlay.classList.remove("show");
  }

  /* -------------------------
     RENDER CART
  --------------------------*/
  function renderCart() {
    cartItems.innerHTML = "";

    cart.forEach((item, index) => {
      cartItems.innerHTML += `
        <div class="cart-item">
          <img src="${item.image}">
          <div class="cart-info">
            <h4>${item.product}</h4>
            <small>${item.brand} • ${item.type}</small>

            <div class="cart-actions">
              <button class="qty-btn" onclick="changeQty(${index}, -1)">−</button>
              <span>${item.qty}</span>
              <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
              <button class="remove-btn" onclick="removeItem(${index})">×</button>
            </div>
          </div>
        </div>`;
    });
  }

  window.changeQty = (index, delta) => {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    updateCartCount();
    renderCart();
  };

  window.removeItem = index => {
    cart.splice(index, 1);
    updateCartCount();
    renderCart();
  };

  /* -------------------------
     CHECKOUT → WHATSAPP + SHEET
  --------------------------*/
  checkoutBtn.onclick = () => {

    if (!cart.length) {
      alert("Cart is empty");
      return;
    }

    let message = "🛒 NEW ORDER\n\n";

    cart.forEach((item, i) => {
      message += `${i + 1}. ${item.product}
Brand: ${item.brand}
Type: ${item.type}
Qty: ${item.qty}
${item.image}\n\n`;

      fetch(sheetURL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "create",
          ...item
        })
      });
    });

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    cart = [];
    localStorage.removeItem("cart");
    updateCartCount();
    closeCart();
  };

});
document.querySelectorAll(".shop-now-btn").forEach(btn => {
  btn.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();

    const card = this.closest(".card");

    const item = {
      brand: card.dataset.brand,
      product: card.querySelector(".card-title").innerText.trim(),
      type: card.querySelector(".card-type").innerText.trim(),
      image: card.querySelector("img").src,
      qty: 1
    };

    // Add to cart
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(i => i.product === item.product);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push(item);
    }
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update cart count
    const cartCountEl = document.getElementById("cartCount");
    cartCountEl.innerText = cart.reduce((s, i) => s + i.qty, 0);

    // Send to Google Sheet
    fetch("https://script.google.com/macros/s/AKfycbxscmDhD47oCUcUq2vBAPfzXiQS5NrH1XL8ViTYOuS0HlqFAEwZYu7pnuUlRz6jCu-Q/exec", {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "create", ...item })
    }).catch(err => console.error("Sheet error:", err));

    // Open WhatsApp with item
    const phoneNumber = "918936969575";
    let message = `🛒 NEW ORDER\n\nBrand: ${item.brand}\nProduct: ${item.product}\nType: ${item.type}\nQty: ${item.qty}\nImage: ${item.image}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");

  });
});
