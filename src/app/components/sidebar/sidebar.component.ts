import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {

  constructor(private router: Router, private authService: AuthService) { }
  setLogOut(): void {
    if (this.authService.getToken()) {
      this.authService.deleteToken();
      this.router.navigate(['/login'])
    }
  }
}
