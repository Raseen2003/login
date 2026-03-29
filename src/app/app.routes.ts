import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './guards/auth.guard';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent,canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
 {path: 'forgot-password', component: ForgotPasswordComponent },
  {path: 'reset-password/:token', component: ResetPasswordComponent},
  { 
    path: 'admin-dashboard', 
    component: AdminDashboardComponent, 
    canActivate: [authGuard, roleGuard] // Both guards must pass
  },
  
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];  