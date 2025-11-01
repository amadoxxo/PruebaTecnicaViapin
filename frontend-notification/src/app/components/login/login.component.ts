import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <mat-card class="login-card">
      <h2>Iniciar sesión</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" />
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Password</mat-label>
          <input matInput formControlName="password" type="password" />
        </mat-form-field>

        <div class="actions">
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || loading">Entrar</button>
        </div>
      </form>

      <p class="msg success" *ngIf="success">Sesión iniciada correctamente</p>
      <p class="msg error" *ngIf="error">{{ error }}</p>
    </mat-card>
  `,
  styles: [
    `
    .login-card { max-width: 420px; margin: 24px auto; padding: 16px; }
    .full-width { width: 100%; }
    .actions { margin-top: 12px; display:flex; justify-content:flex-end }
    .msg { margin-top: 12px }
    .error { color: #c62828 }
    .success { color: #2e7d32 }
    `
  ]
})
export class LoginComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  loading = false;
  error: string | null = null;
  success = false;

  constructor(private fb: FormBuilder, private auth: AuthService) {}

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;
    this.success = false;

  const email = this.form.value.email as string;
  const password = this.form.value.password as string;
  this.auth.login(email, password).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        // token is saved by AuthService; NotificationService listens to token$
      },
      error: err => {
        this.loading = false;
        this.error = err?.error?.message || 'Error en el login';
      }
    });
  }
}
