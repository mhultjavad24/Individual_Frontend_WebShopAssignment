// Shopping cart functionality
const cart = {
    items: [],

    init() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartDisplay();
    },

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        this.saveCart();
        this.updateCartDisplay();
    },

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    },

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = parseInt(quantity);
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    },

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
    },

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    },

    getTotalCost() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    },

    updateCartDisplay() {
        const cartContainer = document.getElementById('cartContainer');
        if (!cartContainer) return;

        if (this.items.length === 0) {
            cartContainer.innerHTML = '<p class="text-center text-muted">Din varukorg är tom</p>';
            return;
        }

        let html = `
            <div class="cart-items">
                ${this.items.map(item => `
                    <div class="cart-item mb-3 p-2 border-bottom">
                        <div class="d-flex align-items-center">
                            <img src="${item.image}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: contain;">
                            <div class="ms-3 flex-grow-1">
                                <h6 class="mb-0">${item.title}</h6>
                                <div class="d-flex align-items-center mt-2">
                                    <input type="number" min="1" value="${item.quantity}" 
                                        onchange="cart.updateQuantity(${item.id}, this.value)"
                                        class="form-control form-control-sm" style="width: 60px;">
                                    <span class="ms-3">$${(item.price * item.quantity).toFixed(2)}</span>
                                    <button onclick="cart.removeItem(${item.id})" 
                                        class="btn btn-sm btn-danger ms-auto">Ta bort</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="cart-footer mt-3">
                <div class="d-flex justify-content-between align-items-center">
                    <h5>Totalt: $${this.getTotalCost()}</h5>
                    <button onclick="cart.clearCart()" class="btn btn-warning">Töm varukorg</button>
                </div>
            </div>
        `;
        cartContainer.innerHTML = html;
    }
};

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => cart.init());