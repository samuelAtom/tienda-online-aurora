import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

export interface User {
  email: string;
  name: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  private readonly USER_KEY = 'current_user';
  private readonly USERS_KEY = 'registered_users';
  private ready: Promise<void>;

  constructor() {
    this.ready = this.loadFromStorage();
  }

  private async loadFromStorage(): Promise<void> {
    const { value } = await Preferences.get({ key: this.USER_KEY });
    if (value) {
      try {
        this.currentUser = JSON.parse(value);
      } catch {
        this.currentUser = null;
      }
    }
  }

  async init(): Promise<void> {
    await this.ready;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Obtener la lista de usuarios registrados
  private async getRegisteredUsers(): Promise<User[]> {
    const { value } = await Preferences.get({ key: this.USERS_KEY });
    if (value) {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return [];
  }

  // Guardar la lista de usuarios registrados
  private async saveRegisteredUsers(users: User[]): Promise<void> {
    await Preferences.set({
      key: this.USERS_KEY,
      value: JSON.stringify(users)
    });
  }

  // Registrar un nuevo usuario
  async register(name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> {
    if (!this.isValidEmail(email)) {
      return { success: false, error: 'Ingrese un correo electrónico válido.' };
    }

    if (password.length < 4) {
      return { success: false, error: 'La contraseña debe tener al menos 4 caracteres.' };
    }

    const users = await this.getRegisteredUsers();

    // Verificar si el correo ya está registrado
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return { success: false, error: 'Este correo ya está registrado.' };
    }

    // Crear el nuevo usuario
    const newUser: User = {
      email: email,
      name: name,
      password: password
    };

    users.push(newUser);
    await this.saveRegisteredUsers(users);

    // Iniciar sesión automáticamente después del registro
    this.currentUser = newUser;
    await Preferences.set({
      key: this.USER_KEY,
      value: JSON.stringify(newUser)
    });

    return { success: true };
  }

  // Iniciar sesión verificando contra los usuarios registrados
  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    if (!this.isValidEmail(email)) {
      return { success: false, error: 'Ingrese un correo electrónico válido.' };
    }

    const users = await this.getRegisteredUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, error: 'No existe una cuenta con este correo.' };
    }

    if (user.password !== password) {
      return { success: false, error: 'Contraseña incorrecta.' };
    }

    this.currentUser = user;
    await Preferences.set({
      key: this.USER_KEY,
      value: JSON.stringify(user)
    });

    return { success: true };
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    await Preferences.remove({ key: this.USER_KEY });
  }

  getUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}