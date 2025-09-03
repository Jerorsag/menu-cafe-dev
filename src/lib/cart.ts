import type { Product } from './types';

const STORAGE_KEY = 'mocawa-cart';
const PHONE = (import.meta.env.PUBLIC_WHATSAPP_PHONE as string) || '';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  qty: number;
  imageUrl?: string;
}

export function getCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function setCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  document.dispatchEvent(new CustomEvent('cart:updated', { detail: items }));
}

export function addToCart(p: Product) {
  const items = getCart();
  const idx = items.findIndex((i) => i.id === p.id);
  if (idx >= 0) items[idx].qty += 1;
  else items.push({ id: p.id, title: p.title, price: p.price, qty: 1, imageUrl: p.imageUrl });
  setCart(items);
}

export function removeFromCart(id: number) {
  const items = getCart().filter((i) => i.id !== id);
  setCart(items);
}

export function clearCart() {
  setCart([]);
}

export function getCartTotals() {
  const items = getCart();
  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);
  return { totalQty, total };
}

/**
 * Construye URL de WhatsApp con mensaje del carrito
 * Ej: https://wa.me/57300...?text=...
 */
export function buildWhatsAppUrl(notes?: string) {
  const items = getCart();
  const lines = items.map((i) => `• ${i.title} x${i.qty} — $${i.price}`);
  const header = `Hola, quiero hacer un pedido Mocawa Café:\n`;
  const footer = notes ? `\nNotas: ${notes}` : '';
  const body = `${header}\n${lines.join('\n')}\n${footer}\n\nGracias.`;
  const text = encodeURIComponent(body);
  return `https://wa.me/${PHONE}?text=${text}`;
}