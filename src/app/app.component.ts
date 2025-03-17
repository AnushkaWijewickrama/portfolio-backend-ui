import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { filter, Subject, Subscription } from 'rxjs';
import { NgIf } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [RouterOutlet, SidebarComponent, NgIf, NgxSpinnerModule]
})
export class AppComponent implements OnInit {
  isLoginPage = false;
  private routerSubscription!: Subscription;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    setInterval(() => {
      if (!this.authService.checkTokenExpiration()) {
        this.router.navigate(['/login']);
      }
      console.log(this.authService.getToken());
    }, 5000); // Check every 5 seconds

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Prevent unnecessary updates
      const newLoginStatus = event.url === '/login';
      if (this.isLoginPage !== newLoginStatus) {
        this.isLoginPage = newLoginStatus;
      }
    });
  }
}
