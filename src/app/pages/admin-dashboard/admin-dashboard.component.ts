import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsersComponent } from '../../components/users/users.component';
import { UserFormComponent } from '../../components/user-form/user-form.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,

  imports: [CommonModule, UsersComponent, UserFormComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);

  
  DisplayName = this.authService.currentUser;
  

  role: string | null = '';

  ngOnInit() {
  
    this.role = localStorage.getItem('userRole');
    

    if (this.role !== 'admin') {
      this.router.navigate(['/home']);
    }
  }


  onLogout() {
    if (confirm('Are you sure you want to log out of the Admin Panel?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}