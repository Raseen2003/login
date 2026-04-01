import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-user-form',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,],
  templateUrl: './edit-user-form.component.html',
  styleUrl: './edit-user-form.component.css',
})
export class EditUserFormComponent implements OnInit {
  editingUserId: string | null = null;
  private fb = inject(FormBuilder);
  

  private authService = inject(AuthService); 

  userForm: FormGroup;
setUserData(user: any) {
  this.editingUserId = user._id; 
  this.userForm.patchValue(user);
}

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


onlyNumbers(event: KeyboardEvent) {
  const isNumber = /[0-9]/.test(event.key);

  const isControlKey = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(event.key);

  if (!isNumber && !isControlKey) {
    event.preventDefault();
  }
}


 onSubmit() {
  if (this.userForm.invalid) return;
  
  const data = this.userForm.value;
  if (this.editingUserId) {

    this.authService.updateContact(this.editingUserId, data).subscribe({
      next: () => { alert('Updated!'); window.location.reload(); }
    });
  } else {

  this.authService.addContact(data).subscribe({
    next: (res: any) => {
      alert('User added successfully!');
      window.location.reload(); 
    },
    error: (err: any) => {
      alert(err.error?.message || 'Error adding user');
    }
  });
}
 }}
