import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[] = [];
  private readonly CART_KEY = 'cart_items';
  private ready: Promise<void>;

  // Subject que notifica cambios en el carrito
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$: Observable<CartItem[]> = this.cartSubject.asObservable();

  constructor() {
    this.ready = this.loadFromStorage();
  }

  private async loadFromStorage(): Promise<void> {
    const { value } = await Preferences.get({ key: this.CART_KEY });
    if (value) {
      try {
        this.items = JSON.parse(value);
      } catch {
        this.items = [];
      }
    }
    this.cartSubject.next([...this.items]);
  }

  private async saveToStorage(): Promise<void> {
    await Preferences.set({
      key: this.CART_KEY,
      value: JSON.stringify(this.items)
    });
    // Notificar a todos los suscriptores
    this.cartSubject.next([...this.items]);
  }

  async init(): Promise<void> {
    await this.ready;
  }

  getItems(): CartItem[] {
    return this.items;
  }

  async addToCart(product: Product): Promise<void> {
    await this.ready;
    const existing = this.items.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({ product, quantity: 1 });
    }
    await this.saveToStorage();
  }

  async removeFromCart(productId: number): Promise<void> {
    await this.ready;
    this.items = this.items.filter(i => i.product.id !== productId);
    await this.saveToStorage();
  }

  async updateQuantity(productId: number, quantity: number): Promise<void> {
    await this.ready;
    const item = this.items.find(i => i.product.id === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        await this.removeFromCart(productId);
      } else {
        await this.saveToStorage();
      }
    }
  }

  getTotal(): number {
    return this.items.reduce((sum, i) => sum + (i.product.price * i.quantity), 0);
  }

  getItemCount(): number {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  async clearCart(): Promise<void> {
    await this.ready;
    this.items = [];
    await this.saveToStorage();
  }
}