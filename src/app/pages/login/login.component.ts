import { Component, } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink,Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder,private auth: AuthService, private router: Router) { 
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
blockSpaces(event: KeyboardEvent) {
  if (event.key === ' ' || event.code === 'Space') {
    event.preventDefault();
  }
}

onSubmit() {
  if (this.loginForm.valid) {
    // 🌟 CLEAN THE DATA (Remove spaces from pasted text)
    const rawData = this.loginForm.value;
    const cleanData = {
      email: rawData.email.trim().toLowerCase(), // Professional: store email in lowercase
      password: rawData.password.trim()
    };

  

   this.auth.login(cleanData).subscribe({
  next: (res: any) => {
    this.auth.saveToken(res.token); 
    this.auth.setUser(res.user.name);
    
    //  Save the role so the guard can check it
    localStorage.setItem('userRole', res.user.role); 

    if (res.user.role === 'admin') {
      // 🚀 This matches your path: 'admin-dashboard'
      this.router.navigate(['/admin-dashboard']); 
    } else {
      this.router.navigate(['/home']); 
    }
  },
  error: (err) => {
        console.error('Login Error:', err);

        // Get the specific message sent by your backend middleware
        const errorMessage = err.error?.message || 'Login failed. Please try again.';

        // Show the alert to the user
        alert(errorMessage);
      }
    });
  }
}
}