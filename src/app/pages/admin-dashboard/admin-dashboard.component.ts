import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsersComponent } from '../../components/users/users.component';
import { UserFormComponent } from '../../components/user-form/user-form.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  // 🌟 Import your sub-components so they work on this page
  imports: [CommonModule, RouterLink, UsersComponent, UserFormComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  // 1. Injecting standard services
  private authService = inject(AuthService);
  private router = inject(Router);

  // 2. Getting the Signal for the name (Welcome, Mohammed!)
  DisplayName = this.authService.currentUser;
  
  // 3. Local variable for extra safety
  role: string | null = '';

  ngOnInit() {
    // Double check the role when the dashboard loads
    this.role = localStorage.getItem('userRole');
    
    // Safety check: if somehow a user bypassed the Guard, kick them out
    if (this.role !== 'admin') {
      this.router.navigate(['/home']);
    }
  }

  // 🚪 Logout function specific to the Dashboard
  onLogout() {
    if (confirm('Are you sure you want to log out of the Admin Panel?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}