import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:5000/api';

  currentUser = signal<string | null>(localStorage.getItem('userName'));

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, password: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password/${token}`, { password });
  }

  addContact(contactData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/add`, contactData);
  }

  // ✅ search param — empty string loads all users
  getContacts(search: string = ''): Observable<any> {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.http.get(`${this.apiUrl}/users/all${params}`);
  }

  deleteContact(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  updateContact(id: string, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}`, updatedData);
  }

  setUser(name: string) {
    localStorage.setItem('userName', name);
    this.currentUser.set(name);
  }

  saveToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  logout() {
    localStorage.clear();
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}