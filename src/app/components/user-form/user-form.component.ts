import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  showPassword = signal<boolean>(false);

  // ✅ Only name, email, password required — phone/address/photo added later via Edit
  userForm: FormGroup = this.fb.group({
    name: ['', [
      Validators.required,
      Validators.pattern('^[a-zA-Z ]*$'),
      Validators.maxLength(15)
    ]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(6)
    ]],
    role: ['user']
  });

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  blockNumbers(event: KeyboardEvent) {
    const isLetter = /^[a-zA-Z ]$/.test(event.key);
    const isControlKey = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(event.key);
    if (!isLetter && !isControlKey) event.preventDefault();
  }

  blockSpaces(event: KeyboardEvent) {
    if (event.key === ' ' || event.code === 'Space') event.preventDefault();
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const cleanData = {
      name: this.userForm.value.name.trim(),
      email: this.userForm.value.email.trim().toLowerCase(),
      password: this.userForm.value.password.trim(),
      role: this.userForm.value.role,
      phoneno: '',
      address: ''
    };

    this.authService.addContact(cleanData).subscribe({
      next: () => {
        alert('New user created! Phone, address & photo can be added via Edit.');
        this.userForm.reset({ role: 'user' });
        window.location.reload();
      },
      error: (err: any) => alert(err.error?.message || 'Error adding user')
    });
  }
}