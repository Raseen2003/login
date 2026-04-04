import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { EditUserFormComponent } from '../edit-user-form/edit-user-form.component';

declare var bootstrap: any; // ✅ tells TypeScript that Bootstrap is available globally

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, EditUserFormComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  private authService = inject(AuthService);

  @ViewChild(EditUserFormComponent) editUserForm!: EditUserFormComponent;

  userList = signal<any[]>([]);
  userRole = signal<string | null>(null);

  lightboxUrl: string | null = null;
  lightboxName: string = '';

  ngOnInit(): void {
    const savedRole = localStorage.getItem('userRole');
    this.userRole.set(savedRole);
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getContacts().subscribe({
      next: (data: any) => this.userList.set(data),
      error: (err) => console.error('Error fetching users:', err)
    });
  }

  openLightbox(url: string, name: string) {
    this.lightboxUrl = url;
    this.lightboxName = name;
  }

  closeLightbox() {
    this.lightboxUrl = null;
    this.lightboxName = '';
  }

  onDelete(id: string) {
    if (confirm('Are you sure you want to permanently delete this user?')) {
      this.authService.deleteContact(id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => alert('Delete failed: ' + err.error.message)
      });
    }
  }

  onEdit(user: any) {
    if (!this.editUserForm) {
      console.error('EditUserForm not found!');
      return;
    }

    this.editUserForm.setUserData(user);

    // ✅ FIXED — editUserModal not addUserModal
    const modalEl = document.getElementById('editUserModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl, { backdrop: true, keyboard: true });
      modal.show();
    }
  }

  onCreateNew() {
    if (this.editUserForm) {
      this.editUserForm.resetForNewUser();
    }
  }
}