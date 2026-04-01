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



 ngOnInit(): void {

    const savedRole = localStorage.getItem('userRole');
    this.userRole.set(savedRole);
    
    this.loadUsers();
  }
  loadUsers() {
    this.authService.getContacts().subscribe({
      next: (data: any) => {
        this.userList.set(data); 
      },
      error: (err) => console.error('Failed to fetch users', err)
    });
  }


  onDelete(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.authService.deleteContact(id).subscribe(() => {
        this.loadUsers();
      });
    }
  }

  onEdit(user: any) {
    if (!this.editUserForm) {
      console.error('Edit form component is not available');
      return;
    }

    this.editUserForm.setUserData(user);
  }
}

