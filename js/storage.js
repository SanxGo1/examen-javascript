const cart_key = "TecnoStockCart";

export function saveCart(cartItems){
    try {
        localStorage.setItem(cart_key, JSON.stringify(cartItems));
    } catch (error) {
        console.error("Error al guardar en local ", error);
    }
}

export function loadCart(){
    try{
        const data = localStorage.getItem(cart_key);
        if(!data){
            return [];
        }
        const parsed = JSON.parse(data);
        if (!Array.isArray(parsed))return [];

        return parsed.filter(item => item && typeof item === 'object' && 'id' in item && 'quantity' in item);

    } catch (error) {
        console.error("Error al cargar el carrito desde localStorage", error);
        return [];
    }
}
