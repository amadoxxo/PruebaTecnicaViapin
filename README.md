# PruebaTecnicaViapin

Sistema de notificaciones en tiempo real construido con Laravel y Angular.

## Configuración del Backend

Sigue estos pasos para configurar el backend:

1. Navega al directorio del backend:

```bash
cd backend-notification
```

1. Instala dependencias de PHP:

```bash
composer install
```

1. Copia el archivo de variables de entorno:

```bash
cp .env.example .env
```

1. Configura las siguientes variables de entorno en el archivo `.env`:

```env
# Configuración de la aplicación
APP_NAME=NotificationSystem
APP_ENV=local
APP_KEY= # Generar con php artisan key:generate
APP_DEBUG=true
APP_URL=http://localhost:8000

# Configuración de la base de datos
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=notification_system
DB_USERNAME=root
DB_PASSWORD=

# Configuración de Pusher/WebSocket
PUSHER_APP_ID=your_pusher_app_id
PUSHER_APP_KEY=your_pusher_app_key
PUSHER_APP_SECRET=your_pusher_secret
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_CLUSTER=mt1

```

1. Inicia el servidor de desarrollo:

```bash
php -S 127.0.0.1:8000
```

1. En otra terminal, inicia el servidor WebSocket:

```bash
php artisan reverb:start
```

## Configuración del Frontend

Sigue estos pasos para configurar el frontend:

1. Navega al directorio del frontend:

```bash
cd ../frontend-notification
```

1. Instala las dependencias:

```bash
npm install
```

1. Crea el archivo de configuración del entorno en `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000',
  pusher: {
    key: 'your_pusher_key',
    cluster: 'mt1',
  }
};
```

1. Inicia el servidor de desarrollo:

```bash
ng serve
```

## Acceso a la Aplicación

- Se acceden de manera local

## Endpoints API

### Autenticación

- POST /api/login - Iniciar sesión
- POST /api/register - Registrar nuevo usuario

### Notificaciones

- GET /api/notifications  - Obtener notificaciones del usuario
- POST /api/notifications - Enviar Notificaciones al usuario autenticado
- PUT /api/notifications/read - Marcar todas las notificaciones como leídas