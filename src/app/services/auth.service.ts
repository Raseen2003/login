import { inject, Injectable, signal,  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
//   private getHeaders() {
//   const token = localStorage.getItem('authToken'); // Make sure this matches your login key
//   return {
//     headers: {
//       'Authorization': `Bearer ${token}`
//     }
//   };
// }
  private http = inject(HttpClient);
  private router = inject(Router);


  currentUser = signal<string | null>(localStorage.getItem('userName'));

 
  private apiUrl = 'http://localhost:5000/api'; 

  constructor() { }

  // --- AUTHENTICATION METHODS ---
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  login(credentials: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/auth/login`, credentials);
}

forgotPassword(email: string) {
  return this.http.post(`${this.apiUrl}/auth/forgot-password`, { email });
}

resetPassword(token: string, password: any) {
  return this.http.post(`${this.apiUrl}/auth/reset-password/${token}`, { password });
}



 

  // ---  NEW CRUD METHODS FOR USER MANAGEMENT 

  
addContact(contactData: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/users/add`, contactData,);
}


getContacts(): Observable<any> {
  return this.http.get(`${this.apiUrl}/users/all`);
}


  deleteContact(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`,);
  }

  
  updateContact(id: string, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}`, updatedData,);
  }

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