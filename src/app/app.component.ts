import { Component, OnInit, NgZone, inject } from '@angular/core'; // 🌟 Added OnInit & inject
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit { 
  title = 'auth-frontend';

  private router = inject(Router);
  private ngZone = inject(NgZone);
  private authService = inject(AuthService);
  

  ngOnInit() {
  window.addEventListener('storage', (event) => {
    console.log("Storage event received:", event.key, event.newValue);

    const isLoggedOut = (event.key === 'authToken' && !event.newValue) || event.key === null;

    if (isLoggedOut) {
      this.ngZone.run(() => {
        console.log('Redirecting to login...');
        
        this.authService.currentUser.set(null); 
        
        this.router.navigate(['/login']);
      });
    }
  });
}
}