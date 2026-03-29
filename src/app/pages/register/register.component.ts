import { Component,signal } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  passwordVisible = signal(false);
  confirmPasswordVisible = signal(false);


  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private auth: AuthService 
  ) {
    this.registerForm = this.fb.group({
  // Only allows alphabets and spaces
  name: ['', [
    Validators.required, 
    Validators.pattern('^[a-zA-Z ]*$') 
  ]],
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(8)]],
  confirmPassword: ['', Validators.required]
}, { 
  validators: this.passwordMatchValidator 
});
  }
togglePassword() {
    this.passwordVisible.update(v => !v);
  }

  toggleConfirmPassword() {
    this.confirmPasswordVisible.update(v => !v);
  }
  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
       ? null : { 'mismatch': true };
  }
  // Prevents the space key from doing anything
blockSpaces(event: KeyboardEvent) {
  if (event.key === ' ' || event.code === 'Space') {
    event.preventDefault();
  }
}

// Cleans the data before sending to Backend (handles Copy-Paste)
trimFormValues() {
  const values = this.registerForm.value;
  return {
    ...values,
    email: values.email?.trim(),
    password: values.password?.trim(),
    confirmPassword: values.confirmPassword?.trim()
  };
} 

 onRegister() {
    if (this.registerForm.valid) {
      // 🌟 STEP 1: Use the cleaning helper you already wrote!
      // This removes any spaces that were pasted into the fields.
      const cleanData = this.trimFormValues();

      console.log('Sending Clean Data to Backend:', cleanData);

      this.auth.register(cleanData).subscribe({
        next: (response) => {
          // 🌟 STEP 2: Check for our standardized 'success' flag
          if (response.success !== false) {
            console.log('Registration Success:', response);
            alert('User Registered Successfully!');
            this.router.navigate(['/login']);
          } else {
            // This catches cases where the backend says success: false
            alert(response.message || 'Registration failed.');
          }
        },
        error: (err) => {
          console.error('Registration Error:', err);
          // 🌟 STEP 3: Professional error messaging
          // Accessing err.error.message ensures the frontend sees the backend validation error
          alert(err.error?.message || 'Server error. Please try again.');
        }
      });
    }
  }
}