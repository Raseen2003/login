import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { EditUserFormComponent } from '../edit-user-form/edit-user-form.component';

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

  // ✅ Lightbox state
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

  // ✅ Open lightbox with the clicked user's full-size photo
  openLightbox(url: string, name: string) {
    this.lightboxUrl = url;
    this.lightboxName = name;
  }

  // ✅ Close lightbox
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
      console.error('Modal component not found!');
      return;
    }
    this.editUserForm.setUserData(user);
  }

  onCreateNew() {
    if (this.editUserForm) {
      this.editUserForm.resetForNewUser();
    }
  }
}