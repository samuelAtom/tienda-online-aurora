import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowBack, cardOutline, locationOutline, personOutline,
  lockClosedOutline, checkmarkCircle, alertCircleOutline,
  shieldCheckmarkOutline
} from 'ionicons/icons';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonIcon]
})
export class CheckoutPage implements OnInit {
  total: number = 0;
  processing: boolean = false;
  success: boolean = false;
  errorMessage: string = '';

  // Datos del formulario
  fullName: string = '';
  address: string = '';
  city: string = '';
  phone: string = '';
  cardNumber: string = '';
  cardName: string = '';
  expiry: string = '';
  cvv: string = '';

  constructor(
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({
      arrowBack, cardOutline, locationOutline, personOutline,
      lockClosedOutline, checkmarkCircle, alertCircleOutline,
      shieldCheckmarkOutline
    });
  }

  async ngOnInit() {
    await this.cartService.init();
    this.total = this.cartService.getTotal();

    // Si el carrito está vacío, regresar
    if (this.cartService.getItems().length === 0) {
      this.router.navigateByUrl('/cart', { replaceUrl: true });
    }
  }

  goBack() {
    this.router.navigateByUrl('/cart');
  }

  // Formatear número de tarjeta: 1234 5678 9012 3456
  formatCardNumber(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\s/g, '').replace(/\D/g, '');
    value = value.substring(0, 16);
    value = value.replace(/(.{4})/g, '$1 ').trim();
    input.value = value;
    this.cardNumber = value;
  }

  // Formatear fecha: MM/AA
  formatExpiry(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    value = value.substring(0, 4);
    if (value.length >= 3) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    input.value = value;
    this.expiry = value;
  }

  // Solo números para CVV y teléfono
  onlyNumbers(event: any, field: string, maxLength: number) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').substring(0, maxLength);
    input.value = value;
    if (field === 'cvv') this.cvv = value;
    if (field === 'phone') this.phone = value;
  }

  // Validar todos los campos
  private validate(): string | null {
    if (!this.fullName.trim() || this.fullName.trim().length < 3) {
      return 'Ingrese su nombre completo (mínimo 3 caracteres).';
    }
        const addressTrimmed = this.address.trim();
    if (addressTrimmed.length < 5) {
      return 'Ingrese una dirección válida (mínimo 5 caracteres).';
    }
    // Debe contener al menos una letra y un número (ej: "Calle 123")
    const hasLetter = /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(addressTrimmed);
    const hasNumber = /\d/.test(addressTrimmed);
    if (!hasLetter || !hasNumber) {
      return 'Ingrese una dirección válida (ejemplo: Calle 123 #45-67).';
    }
    // Evitar letras repetidas sin sentido (ej: "aaaa", "asasasas")
    const lowerAddr = addressTrimmed.toLowerCase().replace(/[\s\d#\-.,]/g, '');
    const uniqueChars = new Set(lowerAddr).size;
    if (lowerAddr.length >= 4 && uniqueChars <= 2) {
      return 'Ingrese una dirección válida (ejemplo: Calle 123 #45-67).';
    }
    if (!this.city.trim()) {
      return 'Ingrese la ciudad.';
    }
    if (this.phone.length < 7) {
      return 'Ingrese un teléfono válido (mínimo 7 dígitos).';
    }
    if (this.cardNumber.replace(/\s/g, '').length !== 16) {
      return 'El número de tarjeta debe tener 16 dígitos.';
    }
    if (!this.cardName.trim() || this.cardName.trim().length < 3) {
      return 'Ingrese el nombre del titular de la tarjeta.';
    }
    // Validar fecha MM/AA
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(this.expiry)) {
      return 'La fecha debe tener el formato MM/AA (ejemplo: 12/28).';
    }
    // Validar que la fecha no esté vencida
    const [month, year] = this.expiry.split('/').map(Number);
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return 'La tarjeta está vencida.';
    }
    if (this.cvv.length < 3) {
      return 'El CVV debe tener al menos 3 dígitos.';
    }
    return null;
  }

  async pay() {
    this.errorMessage = '';

    const validationError = this.validate();
    if (validationError) {
      this.errorMessage = validationError;
      return;
    }

    this.processing = true;
    this.cdr.detectChanges();

    // Simular procesamiento de pago (2 segundos)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Limpiar el carrito
    await this.cartService.clearCart();

    this.processing = false;
    this.success = true;
    this.cdr.detectChanges();
  }

  finish() {
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }
}