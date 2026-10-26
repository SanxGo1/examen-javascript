import { loadCart } from './storage.js';

export class cart {
    constructor(onUpdate = () => {}) {
        this.items = loadCart() || [];
        this.onUpdate = onUpdate;
    }

    addItem(product) {
        if (!product || typeof product !== 'object') return;

        const id = product.id ?? product.productId;
        const existingItem = this.items.find(
            (item) => (item.id ?? item.productId) === id
        );

        if (existingItem) {
            existingItem.quantity = (Number(existingItem.quantity) || 1) + (Number(product.quantity) || 1);
        } else {
            this.items.push({ ...product, quantity: Number(product.quantity) || 1 });
        }

        this._notify();
    }

    // Keep compatibility with callers using the original method spelling.
    additem(product) {
        this.addItem(product);
    }

    removeItem(id) {
        this.items = this.items.filter((item) => (item.id ?? item.productId) !== id);
        this._notify();
    }

    updateQuantity(id, quantity) {
        const item = this.items.find((entry) => (entry.id ?? entry.productId) === id);
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

    getTotal() {
        return this.items.reduce(
            (total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 1),
            0
        );
    }

    getCount() {
        return this.items.reduce((count, item) => count + (Number(item.quantity) || 1), 0);
    }

    _notify() {
        this.onUpdate(this.items, { total: this.getTotal(), count: this.getCount() });
    }
}