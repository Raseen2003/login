import { Component, signal,inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService, } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule,],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  email = signal('');
  message = signal('');
  isLoading = signal(false);

 onSubmit() {
  if (this.email()) {
    this.isLoading.set(true);
    
    this.authService.forgotPassword(this.email()).subscribe({
      next: (res) => {
        this.message.set('Check your email! Reset link sent.');
        this.isLoading.set(false);
      },
      error: (err) => {
        this.message.set('Error: ' + err.error.message);
        this.isLoading.set(false);
      }
    });
  }}
}