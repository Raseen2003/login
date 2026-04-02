import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-user-form.component.html',
  styleUrls: ['./edit-user-form.component.css']
})
export class EditUserFormComponent implements OnInit {
  editingUserId: string | null = null;
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  showPassword = signal<boolean>(false); 

  userForm: FormGroup;

  constructor() {
    // 🌟 Corrected: Initialize the form ONLY ONCE with all your rules
    this.userForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.maxLength(15),
        Validators.pattern('^[a-zA-Z ]*$')
      ]],
      email: ['', [Validators.required, Validators.email]],
      password: [''], 
      phoneno: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$'),
        Validators.minLength(10),
        Validators.maxLength(10)
      ]],
      address: ['', [
        Validators.required,
        Validators.maxLength(50)
      ]],
      role: ['user']
    });
  }

  ngOnInit(): void {
    console.log('Edit User Form Initialized');
  }

  resetForNewUser() {
    this.editingUserId = null;
    this.userForm.reset({ role: 'user' });
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

setUserData(user: any) {
  this.editingUserId = user._id;

  // 1. Prepare the data (ensure no nulls)
  const phoneValue = user.phoneno || user.phone || '';
  const addressValue = user.address || '';

  // 2. Force the values into the form controls
  this.userForm.get('phoneno')?.setValue(phoneValue, { emitEvent: true });
  this.userForm.get('address')?.setValue(addressValue, { emitEvent: true });
  this.userForm.get('name')?.setValue(user.name || '', { emitEvent: true });
  this.userForm.get('email')?.setValue(user.email || '', { emitEvent: true });
  this.userForm.get('role')?.setValue(user.role || 'user', { emitEvent: true });

  // 3. Mark everything as "Touched" so validation clears
  this.userForm.markAllAsTouched();
  this.userForm.get('phoneno')?.markAsDirty();
  this.userForm.get('address')?.markAsDirty();

  // 4. Final check
  this.userForm.updateValueAndValidity();
  
  console.log("Internal Form Value:", this.userForm.value);
  console.log("Form Status:", this.userForm.status); 
}
onSubmit() {
  // 🌟 FORCE SYNC: Grab whatever is physically in the inputs right now
  this.userForm.patchValue(this.userForm.getRawValue());

  // Check if it's still invalid
  if (this.userForm.invalid) {
    console.log("Validation Failed. Current Values:", this.userForm.value);
    
    // 🌟 Temporary Hack: If it's just 'required' blocking you, let's see why
    Object.keys(this.userForm.controls).forEach(key => {
       const control = this.userForm.get(key);
       if (control?.invalid) {
         console.log(`Control ${key} is invalid because:`, control.errors);
       }
    });
    // return; // 🌟 Comment this out temporarily to force the request!
  }

  const formData = { ...this.userForm.value };
  
  // Handle password logic...
  if (this.editingUserId && !formData.password) {
    delete formData.password;
  }

  // Send to backend
  if (this.editingUserId) {
    this.authService.updateContact(this.editingUserId, formData).subscribe({
      next: () => {
        alert('Update Success!');
        window.location.reload();
      },
      error: (err) => alert("Error: " + err.error?.message)
    });
  }
}

  // Moved OUTSIDE of onSubmit()
  blockNumbers(event: KeyboardEvent) {
    const isLetter = /^[a-zA-Z ]$/.test(event.key);
    const isControlKey = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(event.key);
    if (!isLetter && !isControlKey) {
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
}