import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule], // 🌟 Critical: Import this to use [formGroup]
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  userForm: FormGroup;

  constructor() {
    // Initialize the form fields
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneno: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required]
    });
  }

  ngOnInit() {
    // 🌟 This fulfills your request: see typing in the console
    this.userForm.valueChanges.subscribe((currentValues) => {
      console.log('User is typing...', currentValues);
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log('Final Form Data Submitted:', this.userForm.value);
      
      this.authService.addContact(this.userForm.value).subscribe({
        next: (res) => {
          alert('User added successfully!');
          this.userForm.reset();
          // Note: You'll need an @Output here later to refresh the table
        },
        error: (err) => alert(err.error.message || 'Error adding user')
      });
    }
  }
}