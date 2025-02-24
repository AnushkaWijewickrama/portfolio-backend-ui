import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { AsyncPipe, NgIf } from '@angular/common';
import { AuthService } from './util/auth.service';
import { BehaviorSubject, filter, Subject, Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, SidebarComponent, NgIf]
})
export class AppComponent implements OnInit, OnDestroy {
  isLoginPage = false;
  private routerSubscription!: Subscription;
  private destroy$ = new Subject<void>(); // ✅ Added to handle unsubscriptions

  constructor(private router: Router) { }

  ngOnInit() {
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
  ngOnDestroy(): void {
    this.destroy$.next(); // ✅ Triggers unsubscription
    this.destroy$.complete(); // ✅ Cleans up resources
  }

}
