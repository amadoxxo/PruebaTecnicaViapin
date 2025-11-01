import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface AuthResponse {
  user: any;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('api_token'));
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem('api_token', res.token);
        this.tokenSubject.next(res.token);
      })
    );
  }

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { name, email, password }).pipe(
      tap(res => {
        localStorage.setItem('api_token', res.token);
        this.tokenSubject.next(res.token);
      })
    );
  }

  logout(): Observable<any> | void {
    const token = this.getToken();
    if (!token) {
      localStorage.removeItem('api_token');
      this.tokenSubject.next(null);
      return;
    }
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('api_token');
        this.tokenSubject.next(null);
      })
    );
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }
}
