const CART_STORAGE_KEY = 'campusshop_cart_pastel_v1';

export function saveCart(cartItems) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  } catch (error) {
    console.error("Error al guardar el carrito en LocalStorage:", error);
  }
}

export function loadCart() {
  try {
    const data = localStorage.getItem(CART_STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      console.warn("Datos corruptos en LocalStorage, reiniciando carrito.");
      return [];
    }
    return parsed.filter(item => item && item.id != null && item.cantidad > 0);
  } catch (error) {
    console.error("Error al leer LocalStorage, datos corruptos detectados:", error);
    localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  }
}