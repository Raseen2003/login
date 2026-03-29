import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const roleGuard = () => {
  const router = inject(Router);
  const role = localStorage.getItem('userRole');

  if (role === 'admin') {
    return true; // 🔑 Welcome, Admin!
  } else {
    alert('Unauthorized! You do not have Admin access.');
    router.navigate(['/home']); // 🚫 Kick them back to the user home
    return false;
  }
};