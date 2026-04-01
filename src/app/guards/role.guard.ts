import { inject } from '@angular/core';
import { Router, CanActivateFn, } from '@angular/router';


export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const role = localStorage.getItem('userRole');

  if (role === 'admin') {
    return true; 
  } else {
    alert('Access Denied: You do not have Admin privileges.');
    router.navigate(['/home']);
    return false;
  }
};