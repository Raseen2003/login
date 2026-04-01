import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common'; // 
import { UsersComponent } from '../../components/users/users.component';
import { UserFormComponent } from '../../components/user-form/user-form.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ CommonModule, UsersComponent, UserFormComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent  {

  private authService = inject(AuthService);
  private router = inject(Router);


  DisplayName = this.authService.currentUser; 
 

  constructor() {
  
    console.log("Current User Signal:", this.DisplayName());
  }
 
  onLogout() {
    if (confirm('Do you want to logout?')) {
      this.authService.logout(); 
      alert('Logged out successfully');
      this.router.navigate(['/login']);
    }
  }
}