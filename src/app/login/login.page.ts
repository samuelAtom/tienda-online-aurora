import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  bagHandleOutline, mailOutline, lockClosedOutline,
  alertCircleOutline, arrowForwardOutline
} from 'ionicons/icons';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonIcon]
})
export class LoginPage {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {
    addIcons({
      bagHandleOutline, mailOutline, lockClosedOutline,
      alertCircleOutline, arrowForwardOutline
    });
  }

    async onLogin() {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor complete todos los campos.';
      return;
    }

    const result = await this.authService.login(this.email, this.password);
    if (result.success) {
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } else {
      this.errorMessage = result.error || 'Error al iniciar sesión.';
    }
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }
}