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

  constructor() { }

  // --- 🔐 AUTHENTICATION METHODS (UNCHANGED) ---
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

  // --- 🛠️ USER MANAGEMENT CRUD (UPDATED FOR REAL USERS) ---
  
  // Gets all registered users from your MongoDB 'User' collection
addContact(contactData: any): Observable<any> {
  // Hits the POST route we just created
  return this.http.post(`${this.apiUrl}/users/add`, contactData);
}

  getContacts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/all`);
  }

  // Deletes a registered user by ID
  deleteContact(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  // Updates a user (including new fields like phoneno and address)
 updateContact(id: string, updatedData: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/users/${id}`, updatedData); // 👈 Must be .put
}

  // --- ⚙️ UTILITIES ---
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