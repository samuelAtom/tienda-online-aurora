Aurora Shop Tienda Online

Aplicación móvil híbrida de tienda online desarrollada con Ionic,
Angular y Capacitor para las plataformas Android e iOS.

Descripción

Aurora Shop es una aplicación de comercio electrónico que permite a los
usuarios registrarse, iniciar sesión, explorar un catálogo de productos
obtenido desde una API externa, agregar productos a un carrito de
compras persistente y completar un proceso de pago simulado.

El proyecto fue desarrollado como parte de la actividad final de la
asignatura Desarrollo de Aplicaciones Móviles Híbridas, aplicando la
metodología activa de aprendizaje basado en proyectos (ABP).

Funcionalidades principales

Autenticación

Registro de nuevos usuarios con validación de correo electrónico y
contraseña.

Inicio de sesión verificando las credenciales contra los usuarios
registrados.

Persistencia de la sesión con @capacitor/preferences.

Protección de rutas mediante un AuthGuard.

Servicios API

Consumo de la API pública Fake Store
API mediante HttpClient.

Obtención de 16 productos con nombre, descripción, precio, imagen y
categoría.

Manejo de errores con respaldo local (catchError) en caso de fallo
de red.

Carrito de compras

Agregar productos, aumentar y disminuir cantidades.

Eliminar productos individuales o vaciar el carrito completo.

Cálculo automático de subtotales y total.

Persistencia del carrito con @capacitor/preferences.

Almacenamiento local

Uso de @capacitor/preferences como capa de almacenamiento
multiplataforma.

Persistencia de la sesión del usuario, el carrito de compras y los
usuarios registrados.

Compatible con navegador, Android e iOS.

Checkout simulado

Formulario de datos de envío y pago con validaciones.

Simulación de procesamiento de pago.

Limpieza automática del carrito tras confirmar la compra.

Tecnologías utilizadas

Tecnología                 Versión                 Uso

Ionic                      9.x                     Componentes de UI y
framework híbrido

Angular                    Standalone              Framework de desarrollo

Capacitor                  8.x                     Acceso a funciones
nativas

@capacitor/preferences     8.x                     Almacenamiento local
multiplataforma

TypeScript                 5.x                     Lenguaje principal

SCSS                       ---                     Estilos personalizados

Estructura del proyecto

src/
├── app/
│   ├── cart/                     Página del carrito de compras
│   ├── checkout/                 Página de pago simulado
│   ├── guards/                   AuthGuard para proteger rutas
│   ├── home/                     Página principal con el catálogo
│   ├── login/                    Página de inicio de sesión
│   ├── register/                 Página de registro
│   ├── services/
│   │   ├── auth.service.ts       Autenticación y usuarios
│   │   ├── cart.service.ts       Carrito de compras
│   │   └── product.service.ts    Consumo de la API
│   ├── app.component.ts
│   └── app.routes.ts
├── assets/
│   └── products/                 Imágenes locales de respaldo
└── theme/
    └── variables.scss            Paleta de colores personalizada

android/                          Proyecto nativo Android (Capacitor)
ios/                              Proyecto nativo iOS (Capacitor)

Requisitos previos

Node.js 20 o superior

npm 10 o superior

Ionic CLI 7 o superior

Android Studio (para compilar Android)

Xcode (para compilar iOS, solo en macOS)

Instalación y ejecución

1. Clonar el repositorio

git clone https://github.com/samuelAtom/tienda-online-aurora.git
cd tienda-online-aurora

2. Instalar dependencias

npm install

3. Ejecutar en la terminal

ionic serve

La aplicación estará disponible en http://localhost:8100.

4. Compilar y ejecutar en Android

npm run build
npx cap sync android
npx cap open android

Luego, en Android Studio, presionar el botón Run para instalar
la app en un emulador o dispositivo físico.

5. Compilar y ejecutar en iOS

npm run build
npx cap sync ios
npx cap open ios

Luego, en Xcode, seleccionar un simulador de iPhone y presionar Run (requiere macOS).

Credenciales de prueba

El sistema permite registrar nuevos usuarios, para probar rápidamente,
se puede crear una cuenta con cualquier correo válido y una contraseña
de al menos 4 caracteres.

Ejemplo:

Correo: prueba@test.com

Contraseña: 1234

Pruebas realizadas

Android

Emulador: Pixel 7 con Android 17 (API 37.2).

Pruebas de login, registro, catálogo, carrito, checkout y
persistencia.

Corrección de errores de detección de cambios y condiciones de
carrera en el carrito.

iOS

Proyecto nativo generado con Capacitor y configurado con los
permisos necesarios en Info.plist.

Autor

Samuel Steven Rincón Olarte
Correo: sstivenrincon@ucompensar.edu.co
Fundación Universitaria Compensar - Ingeniería de Software

Licencia

Proyecto académico desarrollado con fines educativos.