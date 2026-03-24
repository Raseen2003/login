import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink,Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // 👈 Step 1: Import AuthService

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],// 👈 For navigation links], // 👈 Crucial for Bootstrap forms
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
  
  
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder,private auth: AuthService, private router: Router) { // 👈 Step 2: Inject AuthService
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

onSubmit() {
  if (this.loginForm.valid) {
    this.auth.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        console.log('Login Success!', res);
        this.auth.saveToken(res.token); // Save the JWT to localStorage
        alert('Login Successful!');
        this.router.navigate(['/home']); // Send user to the Home page
      },
      error: (err) => {
        alert(err.error.message || 'Login failed');
      }
    });
  }}
}