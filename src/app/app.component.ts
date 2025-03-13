import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { filter, Subject, Subscription } from 'rxjs';
import { NgIf } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [RouterOutlet, SidebarComponent, NgIf, NgxSpinnerModule]
})
export class AppComponent implements OnInit, OnDestroy {
  isLoginPage = false;
  private routerSubscription!: Subscription;
  private destroy$ = new Subject<void>();

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
    this.destroy$.next();
    this.destroy$.complete();
  }

}
