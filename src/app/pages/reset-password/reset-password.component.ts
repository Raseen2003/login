import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], // 👈 Must include these
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  // 1. Define your variables here
  token: string = '';
  resetForm!: FormGroup; 

  // 2. Inject the tools you need
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    // 3. Logic goes INSIDE ngOnInit
    this.token = this.route.snapshot.params['token'];

    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // 4. This is your custom function to check if passwords are same
  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value 
      ? null : { 'mismatch': true };
  }

  // 5. This function runs when you click the button
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