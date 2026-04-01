import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  // const authService = inject(AuthService); // Make sure this is injected too
  const ngZone = inject(NgZone); // You'll need this for the zone fix
  const token = localStorage.getItem('authToken');

  const authReq = token 
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) 
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        console.warn('Security Breach or Session Expired. Redirecting...');
        
        ngZone.run(() => {
          localStorage.clear();
          const backdrop = document.querySelector('.modal-backdrop');
  if (backdrop) {
    backdrop.remove();
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
          alert('Your session has expired or you do not have permission to access this resource. Please log in again.');
          
          // authService.currentUser.set(null); // Just use 'authService', no 'this'
          router.navigate(['/login']); // Just use 'router', no 'this'
        });
      }
      return throwError(() => error);
    })
  );
};