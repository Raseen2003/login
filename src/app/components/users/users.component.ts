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
  
  // Access the modal component to send data to it
  @ViewChild(EditUserFormComponent) editUserForm!: EditUserFormComponent;

  userList = signal<any[]>([]);
  userRole = signal<string | null>(null);

  ngOnInit(): void {
    // 1. Get role from localStorage (Ensure it's 'admin' or 'user')
    const savedRole = localStorage.getItem('userRole');
    this.userRole.set(savedRole);
    
    // 2. Initial data load
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getContacts().subscribe({
      next: (data: any) => {
        // 'data' should now be the array of users from MongoDB
        this.userList.set(data); 
      },
      error: (err) => console.error('Error fetching registered users:', err)
    });
  }

  onDelete(id: string) {
    if (confirm('Are you sure you want to permanently delete this user?')) {
      this.authService.deleteContact(id).subscribe({
        next: () => {
          this.loadUsers(); // Refresh the list
        },
        error: (err) => alert('Delete failed: ' + err.error.message)
      });
    }
  }

  onEdit(user: any) {
    if (!this.editUserForm) {
      console.error('Modal component not found!');
      return;
    }
    // Pass the real MongoDB user object to the form
    this.editUserForm.setUserData(user);
  }

  // Helper method for the "Create New User" button
  onCreateNew() {
    if (this.editUserForm) {
      this.editUserForm.resetForNewUser();
    }
  }
}