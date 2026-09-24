import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // API real de productos
  private apiUrl = 'https://fakestoreapi.com/products';

  // Productos locales de respaldo (si la API falla)
  private mockProducts: Product[] = [
    {
      id: 1,
      name: 'Camiseta básica',
      description: 'Camiseta de algodón 100% con diseño clásico, ideal para uso diario.',
      price: 45000,
      image: 'assets/products/camiseta.jpg',
      category: 'Ropa'
    },
    {
      id: 2,
      name: 'Mochila urbana',
      description: 'Mochila resistente al agua con compartimento para portátil.',
      price: 120000,
      image: 'assets/products/mochila.jpg',
      category: 'Accesorios'
    },
    {
      id: 3,
      name: 'Audífonos inalámbricos',
      description: 'Audífonos con cancelación de ruido y batería de larga duración.',
      price: 250000,
      image: 'assets/products/audifonos.jpg',
      category: 'Tecnología'
    },
    {
      id: 4,
      name: 'Reloj deportivo',
      description: 'Reloj con monitor de ritmo cardíaco y GPS integrado.',
      price: 180000,
      image: 'assets/products/reloj.jpg',
      category: 'Accesorios'
    },
    {
      id: 5,
      name: 'Bolso de cuero',
      description: 'Bolso elegante de cuero sintético para uso casual o formal.',
      price: 95000,
      image: 'assets/products/bolso.jpg',
      category: 'Accesorios'
    },
    {
      id: 6,
      name: 'Pulsera dorada',
      description: 'Pulsera fina con acabado dorado, perfecta para regalo.',
      price: 60000,
      image: 'assets/products/pulsera.jpg',
      category: 'Joyería'
    }
  ];

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(apiProducts => {
        // Tomar 16 productos de la API
        return apiProducts.slice(0, 16).map(apiProduct => ({
          id: apiProduct.id,
          name: apiProduct.title,
          description: apiProduct.description,
          // La API da precios en USD muy bajos; se multiplica para que parezcan pesos
          price: Math.round(apiProduct.price * 1000),
          image: apiProduct.image,
          category: apiProduct.category
        }));
      }),
      catchError(error => {
        console.warn('API falló, usando productos locales de respaldo:', error);
        return of(this.mockProducts);
      })
    );
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.getProducts().pipe(
      map(products => products.find(p => p.id === id))
    );
  }

  getMockProducts(): Product[] {
    return this.mockProducts;
  }
}