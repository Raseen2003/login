import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { EditUserFormComponent } from '../edit-user-form/edit-user-form.component';

declare var bootstrap: any;

@Component({ 
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, EditUserFormComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  
  private authService = inject(AuthService);

   @ViewChild(EditUserFormComponent) editUserForm!: EditUserFormComponent;
  
  userList = signal<any[]>([]);
  userRole = signal<string | null>(null);

  // Lightbox
  lightboxUrl: string | null = null;
  lightboxName: string = '';

  // Search
  searchQuery: string = '';

  // View More modal
  selectedUser: any = null;

  ngOnInit(): void {
    this.userRole.set(localStorage.getItem('userRole'));
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getContacts(this.searchQuery).subscribe({
      next: (data: any) => this.userList.set(data),
      error: (err) => console.error('Error fetching users:', err)
    });
  }

  onSearch() {
    this.loadUsers();
  }

  clearSearch() {
    this.searchQuery = '';
    this.loadUsers();
  }

  openLightbox(url: string, name: string) {
    this.lightboxUrl = url;
    this.lightboxName = name;
  }

  closeLightbox() {
    this.lightboxUrl = null;
    this.lightboxName = '';
  }

  // Opens View More modal with user details
  viewMore(user: any) {
    this.selectedUser = user;
    const modalEl = document.getElementById('viewMoreModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl, { backdrop: true });
      modal.show();
    }
  }

  // Soft delete
  onDelete(id: string) {
    if (confirm('This user will be deactivated and hidden. Continue?')) {
      this.authService.deleteContact(id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => alert('Delete failed: ' + err.error?.message)
      });
    }
  }

  onEdit(user: any) {
    if (!this.editUserForm) return;
    this.editUserForm.setUserData(user);
    const modalEl = document.getElementById('editUserModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl, { backdrop: true, keyboard: true });
      modal.show();
    }
  }

  onCreateNew() {
    if (this.editUserForm) this.editUserForm.resetForNewUser();
  }


  getProfileUrl(user: any): string | null {
    if (user?.profilePic && user.profilePic !== 'default-avatar.png') {
      return 'http://localhost:5000' + user.profilePic;
    }
    return null;
  }
}