import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon,
  IonFooter, IonButtons, IonBackButton
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  trashOutline, add, remove, cartOutline,
  arrowBack, bagCheckOutline
} from 'ionicons/icons';
import { CartService, CartItem } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonHeader, IonTitle,
    IonToolbar, IonButton, IonIcon, IonFooter, IonButtons, IonBackButton
  ]
})
export class CartPage implements OnInit {
  items: CartItem[] = [];
  total: number = 0;

  constructor(
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({
      trashOutline, add, remove, cartOutline,
      arrowBack, bagCheckOutline
    });
  }

  async ngOnInit() {
    // Esperar a que el servicio esté listo antes de leer los datos
    await this.cartService.init();
    // Pequeño delay para asegurar que el storage terminó de cargar
    await new Promise(resolve => setTimeout(resolve, 50));
    this.refresh();
  }

  refresh() {
    this.items = [...this.cartService.getItems()];
    this.total = this.cartService.getTotal();
    this.cdr.detectChanges();
  }

  async increase(item: CartItem) {
    await this.cartService.updateQuantity(item.product.id, item.quantity + 1);
    this.refresh();
  }

  async decrease(item: CartItem) {
    await this.cartService.updateQuantity(item.product.id, item.quantity - 1);
    this.refresh();
  }

  async remove(item: CartItem) {
    await this.cartService.removeFromCart(item.product.id);
    this.refresh();
  }

  async clearCart() {
    await this.cartService.clearCart();
    this.refresh();
  }

  goToHome() {
    this.router.navigateByUrl('/home');
  }

  async checkout() {
    this.router.navigateByUrl('/checkout');
  }
}