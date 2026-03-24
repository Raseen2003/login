import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html'
})
export class HomeComponent {
  constructor(private router: Router) {}

  onLogout() {
    // 1. Remove the token from the browser's memory
    localStorage.removeItem('authToken');
    
    // 2. Send the user back to the Login page
    alert('Logged out successfully');
    this.router.navigate(['/login']);
  }
}