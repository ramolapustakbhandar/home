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

    document.querySelectorAll(".whatsapp-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();

            const card = button.closest(".card");

            const brand = card.getAttribute("data-brand");
            const productName = card.querySelector(".card-title").innerText.trim();
            const productType = card.querySelector(".card-type").innerText.trim();
            const imageUrl = card.querySelector("img").getAttribute("src");

            // IMAGE LINK MUST BE FIRST OR LAST AND ON NEW LINE
            const message =
`NEW ORDER

${imageUrl}

Brand: ${brand}
Product: ${productName}
Type: ${productType}`;

            const whatsappURL =
                `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

            window.location.href = whatsappURL;
            window.open(whatsappURL, "_blank");
        });
    });
});




