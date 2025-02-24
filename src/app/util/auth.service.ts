import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private loginStatus = new BehaviorSubject<boolean>(false);
    isLoginPage$ = this.loginStatus.asObservable();

    constructor(private router: Router) {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
            this.loginStatus.next(event.url === '/login');
        });
    }
}