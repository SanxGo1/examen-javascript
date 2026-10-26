import { loadCart, saveCart } from './storage.js';

export class Cart {
    constructor(onUpdate = () => {}) {
        this.items = loadCart() || [];
        this.onUpdate = onUpdate;
    }

    addItem(product) {
        if (!product || typeof product !== 'object') return;

        const id = String(product.id ?? product.productId);
        const existingItem = this.items.find((item) => String(item.id) === id);

        if (existingItem) {
            existingItem.quantity = (Number(existingItem.quantity) || 1) + 1;
        } else {
            this.items.push({
                id: id,
                name: product.name,
                price: Number(product.price) || 0,
                stock: Number(product.stock) || 0,
                image: product.image || '',
                quantity: 1
            });
        }

        this._notify();
    }

    removeItem(id) {
        this.items = this.items.filter((item) => String(item.id) !== String(id));
        this._notify();
    }

    updateQuantity(id, quantity) {
        const item = this.items.find((entry) => String(entry.id) === String(id));
        const amount = Number(quantity);
        if (!item || !Number.isFinite(amount)) return;

        if (amount <= 0) {
            this.removeItem(id);
            return;
        }

        item.quantity = amount;
        this._notify();
    }

    clear() {
        this.items = [];
        this._notify();
    }

    getTotalPrice() {
        return this.items.reduce(
            (total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 1),
            0
        );
    }

    getTotalItems() {
        return this.items.reduce((count, item) => count + (Number(item.quantity) || 1), 0);
    }

    // Alias de compatibilidad
    getTotal() { return this.getTotalPrice(); }
    getCount() { return this.getTotalItems(); }

    _notify() {
        saveCart(this.items);
        this.onUpdate(this);
    }
}