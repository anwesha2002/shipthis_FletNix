import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, RegisterRequest, User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = 'fletnix_token';

  constructor(private http: HttpClient) {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const user = this.getUserFromToken(token);
      this.currentUserSubject.next(user);
    }
  }

  login(credentials: LoginRequest): Observable<User> {
    return this.http.post<User>(`${environment.apiBaseUrl}/auth/login`, credentials)
      .pipe(tap(user => this.handleAuthentication(user)));
  }

  register(data: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${environment.apiBaseUrl}/auth/register`, data)
      .pipe(tap(user => this.handleAuthentication(user)));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  private handleAuthentication(user: User): void {
    if (user.token) {
      localStorage.setItem(this.tokenKey, user.token);
      this.currentUserSubject.next(user);
    }
  }

  private getUserFromToken(token: string): User {
    try {
      // Validate token format
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token structure');
      }

      // Decode the payload (second part)
      const payload = parts[1];

      // Replace URL-safe characters and decode base64
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const decoded = JSON.parse(jsonPayload);

      // Check expiration
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        throw new Error('Token expired');
      }

      // Extract user data
      return {
        id: decoded.userId || decoded.sub || decoded.id || 'unknown',
        email: decoded.email || 'unknown@example.com',
        age: decoded.age || 18,
        token
      };
    } catch (error) {
      console.error('Token decoding error:', error);
      throw error;
    }
  }
}
