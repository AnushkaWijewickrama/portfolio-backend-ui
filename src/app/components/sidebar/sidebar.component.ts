import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {

  constructor(private router: Router) { }
  setLogOut(): void {
    if (localStorage.getItem('authenticationToken')) {
      localStorage.removeItem('authenticationToken')
      this.router.navigate(['/login'])
    }
  }
}
