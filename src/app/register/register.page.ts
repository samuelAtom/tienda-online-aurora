import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  personAddOutline, personOutline, mailOutline, lockClosedOutline,
  shieldCheckmarkOutline, alertCircleOutline, arrowForwardOutline
} from 'ionicons/icons';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonIcon]
})
export class RegisterPage {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {
    addIcons({
      personAddOutline, personOutline, mailOutline, lockClosedOutline,
      shieldCheckmarkOutline, alertCircleOutline, arrowForwardOutline
    });
  }

    async onRegister() {
    this.errorMessage = '';

    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Por favor complete todos los campos.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    const result = await this.authService.register(this.name, this.email, this.password);
    if (result.success) {
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } else {
      this.errorMessage = result.error || 'Error al crear la cuenta.';
    }
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
}