import { saveCart, loadCart } from './storage.js';

export class ShoppingCartManager {
  constructor() {
    this.items = loadCart();
  }

  getItems() {
    return this.items;
  }

  addItem(product, quantity = 1) {
    if (!product.activo || product.stock <= 0) {
      throw new Error("El producto está agotado o inactivo (P08).");
    }

    const existingIndex = this.items.findIndex(item => item.id === product.id);
    const currentQtyInCart = existingIndex >= 0 ? this.items[existingIndex].cantidad : 0;
    const requestedTotal = currentQtyInCart + quantity;

    if (requestedTotal > product.stock) {
      throw new Error(`No hay suficiente stock disponible. Stock máximo: ${product.stock} (P07).`);
    }

    if (existingIndex >= 0) {
      this.items[existingIndex].cantidad = requestedTotal;
    } else {
      this.items.push({
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        stock: product.stock,
        imagen: product.imagen,
        cantidad: quantity
      });
    }

    this.persist();
  }

  updateQuantity(productId, newQuantity) {
    const index = this.items.findIndex(item => item.id === productId);
    if (index >= 0) {
      if (newQuantity <= 0) {
        this.removeItem(productId);
      } else {
        if (newQuantity > this.items[index].stock) {
          throw new Error(`La cantidad supera el stock disponible (${this.items[index].stock}).`);
        }
        this.items[index].cantidad = newQuantity;
        this.persist();
      }
    }
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.persist();
  }

  clear() {
    this.items = [];
    this.persist();
  }

  calculateTotals() {
    const subtotal = this.items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const appliesDiscount = subtotal >= 300000;
    const discount = appliesDiscount ? subtotal * 0.10 : 0;
    const total = subtotal - discount;

    return {
      subtotal,
      appliesDiscount,
      discount,
      total
    };
  }

  persist() {
    saveCart(this.items);
  }
}
