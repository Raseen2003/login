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

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  existingPicUrl: string | null = null;

  userForm: FormGroup;

  constructor() {
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

  ngOnInit(): void {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.existingPicUrl = null;
      const reader = new FileReader();
      reader.onload = (e) => this.previewUrl = e.target?.result as string;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  resetForNewUser() {
    this.editingUserId = null;
    this.selectedFile = null;
    this.previewUrl = null;
    this.existingPicUrl = null;
    this.userForm.reset({ role: 'user' });
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  setUserData(user: any) {
    this.editingUserId = user._id;
    this.selectedFile = null;
    this.previewUrl = null;

    if (user.profilePic && user.profilePic !== 'default-avatar.png') {
      this.existingPicUrl = 'http://localhost:5000' + user.profilePic;
    } else {
      this.existingPicUrl = null;
    }

    this.userForm.patchValue({
      name: user.name || '',
      email: user.email || '',
      phoneno: user.phoneno || user.phone || '',
      address: user.address || '',
      role: user.role || 'user',
      password: ''
    });

    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.markAllAsTouched();
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const fd = new FormData();
    const formValues = this.userForm.getRawValue();

    Object.keys(formValues).forEach(key => {
      const value = formValues[key];
      if (key === 'password' && !value && this.editingUserId) return;
      if (value !== null && value !== undefined) {
        fd.append(key, value);
      }
    });

    if (this.selectedFile) {
      fd.append('profilePic', this.selectedFile);
    }

    if (this.editingUserId) {
      this.authService.updateContact(this.editingUserId, fd).subscribe({
        next: () => {
          alert('Update Success!');
          window.location.reload();
        },
        error: (err) => alert(err.error?.message || 'Upload Failed')
      });
    }
  }

  blockNumbers(event: KeyboardEvent) {
    const isLetter = /^[a-zA-Z ]$/.test(event.key);
    const isControlKey = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(event.key);
    if (!isLetter && !isControlKey) event.preventDefault();
  }

  onlyNumbers(event: KeyboardEvent) {
    const isNumber = /[0-9]/.test(event.key);
    const isControlKey = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(event.key);
    if (!isNumber && !isControlKey) event.preventDefault();
  }
}