import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend-project-management';
  currentRoute: string = '';

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
  }



  isProjectDetailsPage(): boolean {
    return this.router.url === '/project-details'; 
  }

  isProjectPage(): boolean {
    return this.router.url === '/project'; 
  }

  isLoginPage(): boolean {
    return this.currentRoute === '/';
  }
  isDashboardPage(): boolean {
    return this.router.url === '/dashboard'; 
  }
  
}
