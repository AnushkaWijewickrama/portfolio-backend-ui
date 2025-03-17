import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
  form!: FormGroup;

  constructor(private authService: AuthService, private route: Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required)
    });
  }

  onSubmit(): void {
    this.authService.create(this.form?.value)
      .subscribe((result) => {
        console.log(result?.body?.token)
        this.authService.setToken(result?.body?.token)
        if (this.route.url !== '/') {
          this.route.navigate(['/']); // Only navigate if necessary
        }

      }, (error) => {
        alert('Username/password combination is wrong');
      });
  }

}
