import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NotificationBellComponent } from './components/notification-bell/notification-bell.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    NotificationBellComponent,
    HttpClientModule
  ],
  template: `
    <div style="height: 100vh; display: flex; flex-direction: column;">
      <mat-toolbar color="primary">
        <span>Mi Aplicación</span>
        <span class="spacer"></span>
        <app-notification-bell></app-notification-bell>
      </mat-toolbar>

      <div class="content">
        <h1>Bienvenido</h1>
        <p>Sistema de notificaciones</p>
      </div>
    </div>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }

    .content {
      padding: 20px;
    }

    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class AppComponent {
  title = 'frontend-notification';
}
