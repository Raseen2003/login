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

    console.log('Sending Clean Login Data:', cleanData);

    this.auth.login(cleanData).subscribe({
      next: (res: any) => {
        // Save token and user info as usual
        this.auth.saveToken(res.token); 
        this.auth.setUser(res.user.name);

        alert('Login Successful!');
        this.router.navigate(['/home']); 
      },
      error: (err) => {
        // Show the backend error (like "Invalid password")
        alert(err.error?.message || 'Login failed');
      }
    });
  }
}
}