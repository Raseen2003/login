import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
  const router = inject(Router);
  const token = localStorage.getItem('authToken');

  if (token) {
    return true; // Token exists, let them in!
  } else {
    router.navigate(['/login']); // No token, kick them back to login
    return false;
  }
};