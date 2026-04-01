import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule], 
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
 
  token: string = '';
  resetForm!: FormGroup; 

  // 2. Inject the tools you need
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    
    this.token = this.route.snapshot.params['token'];

    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }


  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value 
      ? null : { 'mismatch': true };
  }


  onSubmit() {
    if (this.resetForm.valid) {
      const newPassword = this.resetForm.value.password;
      
      this.authService.resetPassword(this.token, newPassword).subscribe({
        next: (res) => {
          alert("Password updated!");
          this.router.navigate(['/login']);
        },
        error: (err) => {
          alert("Error: " + err.error.message);
        }
      });
    }
  }
}