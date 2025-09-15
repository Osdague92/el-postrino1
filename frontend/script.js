/* ======================================================= */
/* ARCHIVO: script.js                     */
/* ======================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // --- FUNCIONALIDAD 1: SLIDER AUTOMÁTICO PARA EL HERO ---
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (n) => {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        if (n >= slides.length) { currentSlide = 0; }
        else if (n < 0) { currentSlide = slides.length - 1; }
        else { currentSlide = n; }
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    };

    const nextSlide = () => showSlide(currentSlide + 1);
    const startSlideShow = () => slideInterval = setInterval(nextSlide, 5000);
    const resetSlideShow = () => {
        clearInterval(slideInterval);
        startSlideShow();
    };

    if(slides.length > 0) {
        nextBtn.addEventListener('click', () => { nextSlide(); resetSlideShow(); });
        prevBtn.addEventListener('click', () => { showSlide(currentSlide - 1); resetSlideShow(); });
        dots.forEach(dot => dot.addEventListener('click', (e) => {
            showSlide(parseInt(e.target.getAttribute('data-slide')));
            resetSlideShow();
        }));
        showSlide(currentSlide);
        startSlideShow();
    }

    // --- FUNCIONALIDAD 2: Animación de tarjetas al hacer scroll ---
    const cards = document.querySelectorAll('.postre-card');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    cards.forEach(card => observer.observe(card));

    // --- FUNCIONALIDAD 3: Manejo del botón de Login con Google ---
    const googleLoginButton = document.getElementById('google-login');
    if (googleLoginButton) {
        googleLoginButton.addEventListener('click', () => {
            console.log('Botón de "Registrarse con Google" presionado. Aquí iría la lógica de Firebase.');
        });
    }

    // --- FUNCIONALIDAD 4: CARRITO DE COMPRAS ---
    let cart = [];
    let currentProduct = {};

    // Elementos del DOM
    const customizationModal = document.getElementById('customization-modal');
    const cartModal = document.getElementById('cart-modal');
    const cartIcon = document.getElementById('cartIcon');
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalEl = document.getElementById('cart-total');
    const closeCustomModalBtn = document.getElementById('close-custom-modal');
    const closeCartModalBtn = document.getElementById('close-cart-modal');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const modalOptions = document.getElementById('modal-options');
    const quantityInput = document.getElementById('quantity');

    // Función para actualizar el contador del carrito en el ícono
    const updateCartCount = () => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    };

    // Función para mostrar los items en el modal del carrito
    const renderCartItems = () => {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
        } else {
            cart.forEach((item, index) => {
                const itemEl = document.createElement('div');
                itemEl.classList.add('cart-item');
                let adicionalesText = item.adicionales.map(ad => ad.text).join(', ');
                itemEl.innerHTML = `
                    <div class="cart-item-details">
                        <p><strong>${item.quantity} x ${item.name}</strong></p>
                        ${adicionalesText ? `<small>Adicionales: ${adicionalesText}</small>` : ''}
                    </div>
                    <div class="cart-item-actions">
                        <span>$${(item.totalPrice * item.quantity).toFixed(2)}</span>
                        <button class="remove-item-btn" data-index="${index}">&times;</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemEl);
            });
        }
        updateCartTotal();
    };

    // Función para actualizar el precio total en el modal del carrito
    const updateCartTotal = () => {
        const total = cart.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
        cartTotalEl.textContent = total.toFixed(2);
    };

    // Abrir modal de personalización al hacer clic en "Armar mi postre"
    document.querySelectorAll('.customize-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const name = e.target.dataset.name;
            const price = parseFloat(e.target.dataset.price);
            currentProduct = { name, price };
            
            document.getElementById('modal-product-name').textContent = name;
            document.getElementById('modal-base-price').textContent = price.toFixed(2);
            quantityInput.value = 1;
            document.querySelectorAll('#modal-options input[type="checkbox"]').forEach(cb => cb.checked = false);
            
            updateModalTotal();
            customizationModal.classList.add('visible');
        });
    });

    // Función para calcular el total en el modal de personalización
    const updateModalTotal = () => {
        let total = currentProduct.price;
        let adicionales = [];
        document.querySelectorAll('#modal-options input:checked').forEach(checkbox => {
            total += parseFloat(checkbox.value);
            adicionales.push({ text: checkbox.dataset.text, price: parseFloat(checkbox.value) });
        });
        const quantity = parseInt(quantityInput.value) || 1;
        document.getElementById('modal-total-price').textContent = (total * quantity).toFixed(2);
        currentProduct.adicionales = adicionales;
        currentProduct.totalPrice = total;
    };

    // Event listeners para actualizar el total del modal
    modalOptions.addEventListener('change', updateModalTotal);
    quantityInput.addEventListener('input', updateModalTotal);

    // Añadir el producto al carrito
    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value) || 1;
        const newItem = {
            name: currentProduct.name,
            totalPrice: currentProduct.totalPrice,
            adicionales: currentProduct.adicionales,
            quantity: quantity
        };
        cart.push(newItem);
        updateCartCount();
        renderCartItems();
        customizationModal.classList.remove('visible');
    });

    // Abrir y cerrar los modales
    cartIcon.addEventListener('click', () => cartModal.classList.add('visible'));
    closeCustomModalBtn.addEventListener('click', () => customizationModal.classList.remove('visible'));
    closeCartModalBtn.addEventListener('click', () => cartModal.classList.remove('visible'));

    // Cerrar modales al hacer clic fuera del contenido
    customizationModal.addEventListener('click', (e) => {
        if (e.target === customizationModal) {
            customizationModal.classList.remove('visible');
        }
    });
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('visible');
        }
    });

    // Eliminar un item del carrito
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item-btn')) {
            const index = parseInt(e.target.dataset.index);
            cart.splice(index, 1);
            renderCartItems();
            updateCartCount();
        }
    });

});