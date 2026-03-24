import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // The tool that makes API calls
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // This makes the service available everywhere in your app
})
export class AuthService {

  // This MUST match your Node.js server port (usually 5000)
  private apiUrl = 'http://localhost:5000/api'; 

  constructor(private http: HttpClient) { }

  // 1. Function to send Register data to Node.js
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // 2. Function to send Login data to Node.js
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // 3. Helper to save the Token after a successful login
  saveToken(token: string) {
    localStorage.setItem('authToken', token);
  }
}