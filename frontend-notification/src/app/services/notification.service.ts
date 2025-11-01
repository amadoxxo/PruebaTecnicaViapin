import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Notification } from '../models/notification.model';
import Echo from 'laravel-echo';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8000/api';
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private echo: Echo<any> | null = null;
  private initialized = false;
  private currentUserId: number | null = null;
  private currentChannel: any = null;

  constructor(private http: HttpClient, private authService: AuthService) {
    // Esperar a que exista token antes de inicializar Echo y las peticiones protegidas
    this.authService.token$.subscribe(token => {
      if (token) {
        // Si no está inicializado, inicializamos Echo/Pusher y la escucha en tiempo real
        if (!this.initialized) {
          this.initialized = true;

          // Usar el cliente Pusher proporcionado globalmente por el script (window.Pusher)
          const PusherAny = (window as any).Pusher;
          const pusherClient = new PusherAny('local', {
            wsHost: window.location.hostname,
            wsPort: 8080,
            wssPort: 8080,
            forceTLS: false,
            enabledTransports: ['ws', 'wss'],
            disableStats: true,
            cluster: 'mt1'
          });

          // Configurar Laravel Echo con Pusher (apunta al servidor Reverb local)
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

          // Obtener usuario autenticado y suscribirse al canal correspondiente
          this.http.get<any>(`${this.apiUrl}/user`).subscribe({
            next: (user) => {
              const userId = user?.id;
              if (userId) {
                this.currentUserId = userId;
                this.subscribeToUserChannel(userId);
              }
            },
            error: (err) => {
              console.warn('No se pudo obtener el usuario autenticado:', err);
            }
          });

          // Refrescar notificaciones cada 3 segundos
          interval(3000).pipe(
            switchMap(() => this.fetchNotifications())
          ).subscribe();
        }

        // Siempre que haya token (login), forzamos una recarga de las notificaciones
        this.fetchNotifications().subscribe();
      } else {
        // Si se cerró sesión, limpiamos el estado local
        this.notificationsSubject.next([]);
      }
    });
  }

  private listenToNotifications(): void {
    // Deprecated: use subscribeToUserChannel(userId) which manages subscribe/unsubscribe
    return;
  }

  private subscribeToUserChannel(userId: number) {
    if (!this.echo) return;

    // Si ya estamos suscritos a otro canal, lo limpiamos
    try {
      if (this.currentChannel) {
        // unsubscribe and leave
        if (typeof this.currentChannel.unsubscribe === 'function') {
          this.currentChannel.unsubscribe();
        }
        if (typeof (this.echo as any).leaveChannel === 'function') {
          (this.echo as any).leaveChannel(`notifications.${this.currentUserId}`);
        }
      }
    } catch (e) {
      // ignore
    }

    this.currentUserId = userId;
    this.currentChannel = this.echo.channel(`notifications.${userId}`);
    this.currentChannel.listen('.userNotification.created', (event: { notification: Notification }) => {
      console.log('Nueva notificación recibida:', event);
      const currentNotifications = this.notificationsSubject.value;
      this.notificationsSubject.next([event.notification, ...currentNotifications]);
    });
  }

  fetchNotifications(): Observable<Notification[]> {
    const token = this.authService.getToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    // Log token presence for debugging
    console.log('Fetching notifications. token present:', !!token);

    return this.http.get<Notification[]>(`${this.apiUrl}/notifications`, { headers }).pipe(
      tap(notifications => this.notificationsSubject.next(notifications))
    );
  }

  markAllAsRead(): Observable<any> {
    const token = this.authService.getToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    return this.http.put(`${this.apiUrl}/notifications/read`, {}, { headers }).pipe(
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
