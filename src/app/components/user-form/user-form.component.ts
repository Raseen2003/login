import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule], 
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  

  private authService = inject(AuthService); 

  userForm: FormGroup;

  constructor() {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]], 
      email: ['', [Validators.required, Validators.email]],
      phoneno: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required],
      role: ['user']
    });
  }


  ngOnInit(): void {
    console.log('User Form Component Initialized');
  }
blockSpaces(event: KeyboardEvent) {
  if (event.key === ' ' || event.code === 'Space') {
    event.preventDefault();
  }
}


trimFormValues() {
  const values = this.userForm.value;
  return {
    ...values,
    email: values.email?.trim(),
    phoneno: values.phoneno?.trim()
   
  };
} 

  onSubmit() {
    if (this.userForm.valid) {
      const rawData = this.userForm.value;
      const cleanData = {
        ...rawData,
        username: rawData.username.trim(),
        email: rawData.email.trim().toLowerCase()
      };

    
      this.authService.addContact(cleanData).subscribe({
        next: (res: any) => {
          alert('User added to System successfully!');
          this.userForm.reset();
          window.location.reload(); 
        },
        error: (err: any) => alert(err.error?.message || 'Error adding user')
      });
    }
  }
}