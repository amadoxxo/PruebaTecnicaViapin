import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Notification } from '../models/notification.model';
import Echo from 'laravel-echo';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8000/api';
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private echo: Echo<any>;

  constructor(private http: HttpClient) {
  // Usar el cliente Pusher proporcionado globalmente por el script (window.Pusher)
  // Evita errores de tipado con los paquetes ESM/UMD de pusher-js
  const PusherAny = (window as any).Pusher;
  const pusherClient = new PusherAny('local', {
    wsHost: window.location.hostname,
    wsPort: 8080,
    wssPort: 8080,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
    // Añadimos cluster para satisfacer la validación del cliente Pusher
    cluster: 'mt1'
  });

    // Configurar Laravel Echo con Reverb
  this.echo = new Echo({
    broadcaster: 'pusher',
    key: 'local',
    cluster: 'mt1',
    wsHost: window.location.hostname,
    wsPort: 8080,
    wssPort: 8080,
    forceTLS: false,
    encrypted: false,
    disableStats: true,
    client: pusherClient
  });

    // Escuchar notificaciones en tiempo real
    this.listenToNotifications();

    // Refrescar notificaciones cada 30 segundos
    interval(30000).pipe(
      switchMap(() => this.fetchNotifications())
    ).subscribe();

    // Cargar notificaciones iniciales
    this.fetchNotifications().subscribe();
  }

  private listenToNotifications(): void {
    const userId = 1; // Esto debería venir del servicio de autenticación
    this.echo.channel(`notifications.${userId}`)
      .listen('.userNotification.created', (event: { notification: Notification }) => {
        console.log('Nueva notificación recibida:', event);
        const currentNotifications = this.notificationsSubject.value;
        this.notificationsSubject.next([event.notification, ...currentNotifications]);
      });
  }

  fetchNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/notifications`).pipe(
      tap(notifications => this.notificationsSubject.next(notifications))
    );
  }

  markAllAsRead(): Observable<any> {
    return this.http.put(`${this.apiUrl}/notifications/read`, {}).pipe(
      tap(() => {
        const currentNotifications = this.notificationsSubject.value;
        const updatedNotifications = currentNotifications.map(notification => ({
          ...notification,
          read: true
        }));
        this.notificationsSubject.next(updatedNotifications);
      })
    );
  }

  getUnreadCount(): Observable<number> {
    return new Observable<number>(observer => {
      this.notifications$.subscribe(notifications => {
        const count = notifications.filter(n => !n.read).length;
        observer.next(count);
      });
    });
  }
}
