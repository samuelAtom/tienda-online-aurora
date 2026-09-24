import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    // Esperar a que el servicio termine de inicializar
    await this.authService.init();

    if (this.authService.isAuthenticated()) {
      return true;
    }

    this.router.navigateByUrl('/login', { replaceUrl: true });
    return false;
  }
}