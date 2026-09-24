import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon,
  IonBadge, IonButtons, IonSpinner
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cart, cartOutline, logOut, logOutOutline } from 'ionicons/icons';
import { ViewWillEnter } from '@ionic/angular';
import { ProductService, Product } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonIcon, IonBadge, IonButtons, IonSpinner
  ],
})
export class HomePage implements ViewWillEnter, OnDestroy {
  products: Product[] = [];
  loading: boolean = true;
  cartCount: number = 0;
  private cartSub: Subscription | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ cart, cartOutline, logOut, logOutOutline });
  }

  async ionViewWillEnter() {
    await this.cartService.init();
    this.updateCartCount();

    // Suscribirse a los cambios del carrito en tiempo real
    if (!this.cartSub) {
      this.cartSub = this.cartService.cart$.subscribe(() => {
        this.updateCartCount();
      });
    }

    if (this.products.length === 0) {
      this.loadProducts();
    }
  }

  ngOnDestroy() {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
        this.products = this.productService.getMockProducts();
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  async addToCart(product: Product) {
    await this.cartService.addToCart(product);
    this.cdr.detectChanges();
  }

  updateCartCount() {
    this.cartCount = this.cartService.getItemCount();
    this.cdr.detectChanges();
  }

  goToCart() {
    this.router.navigateByUrl('/cart');
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}