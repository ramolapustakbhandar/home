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

    document.querySelectorAll(".whatsapp-btn").forEach(btn => {

        btn.addEventListener("click", function (e) {
            e.preventDefault();

            const card = this.closest(".card");

            const brand = card.dataset.brand || "";
            const product = card.querySelector(".card-title")?.innerText.trim() || "";
            const type = card.querySelector(".card-type")?.innerText.trim() || "";
            const image = card.querySelector("img")?.src || "";

            // Send order to Google Sheet
            fetch(sheetURL, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify({
                    brand: brand,
                    product: product,
                    type: type,
                    image: image
                })
            });

            // WhatsApp message
            const message =
`NEW ORDER 📦

Brand: ${brand}
Product: ${product}
Type: ${type}

Image:
${image}`;

            window.open(
                `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
                "_blank"
            );
        });

    });
});






