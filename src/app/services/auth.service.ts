import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Signal for the logged-in user name
  currentUser = signal<string | null>(localStorage.getItem('userName'));

  // Ensure this matches your Node.js base URL
  private apiUrl = 'http://localhost:5000/api'; 

  constructor() { }

  // --- AUTHENTICATION METHODS ---
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, password: any) {
    return this.http.post(`${this.apiUrl}/reset-password/${token}`, { password });
  }

  // ---  NEW CRUD METHODS (To fix your Error) ---

  // 1. Fetch all products/users added by current user
  getAddedUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/contacts`);
  }

  // 2. Add a new product/user
  addContact(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-contact`, userData);
  }

  // 3. Delete a product/user
  deleteContact(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/contact/${id}`);
  }

  // --- SESSION HELPERS ---
  setUser(name: string) {
    localStorage.setItem('userName', name);
    this.currentUser.set(name);
  }

  saveToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  logout() {
    localStorage.clear(); // Clears everything (Token + Name)
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}