import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification.model';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [
    CommonModule,
    MatBadgeModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatListModule
  ],
  template: `
    <div class="notification-bell">
      <button mat-icon-button [matMenuTriggerFor]="menu">
        <mat-icon [matBadge]="unreadCount" [matBadgeHidden]="unreadCount === 0" matBadgeColor="warn">
          notifications
        </mat-icon>
      </button>

      <mat-menu #menu="matMenu" class="notification-menu">
        <div class="notification-header">
          <h3 class="mat-h2">Notificaciones</h3>
          <button mat-button color="primary" (click)="markAllAsRead()"
                  [disabled]="unreadCount === 0">
            Marcar todas como leídas
          </button>
        </div>

        <mat-list>
          <mat-list-item *ngFor="let notification of notifications"
                         [class.unread]="!notification.read">
            <mat-icon matListItemIcon>notification_important</mat-icon>
            <div matListItemTitle>{{notification.title}}</div>
            <div matListItemLine>{{notification.message}}</div>
          </mat-list-item>

          <mat-list-item *ngIf="notifications.length === 0">
            <div matListItemTitle>No hay notificaciones</div>
          </mat-list-item>
        </mat-list>
      </mat-menu>
    </div>
  `,
  styles: [`
    .notification-bell {
      display: inline-block;
    }

    .notification-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 16px;
      border-bottom: 1px solid rgba(0,0,0,0.12);
    }

    .notification-menu {
      min-width: 350px;
      max-width: 350px;
    }

    .unread {
      background-color: rgba(0,0,0,0.04);
    }

    mat-list-item {
      margin: 8px 0;
    }
  `]
})
export class NotificationBellComponent implements OnInit {
  notifications: Notification[] = [];
  unreadCount = 0;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
      this.unreadCount = notifications.filter(n => !n.read).length;
    });
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe();
  }
}
