import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // 👈 Step 1: Import confirmed

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  // 👈 Step 2: Added 'auth' to the constructor
  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private auth: AuthService 
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
       ? null : { 'mismatch': true };
  }

  onRegister() {
    if (this.registerForm.valid) {
      // 👈 Step 3: Call the AuthService
      this.auth.register(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('✅ Registration Success:', response);
          alert('User Registered Successfully!');
          this.router.navigate(['/login']); // Redirect to login page
        },
        error: (err) => {
          console.error('❌ Registration Error:', err);
          alert(err.error.message || 'Registration failed. Try again.');
        }
      });
    }
  }
}