import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { SERVER_API_URL } from "../util/common-util";
import { CookieService } from "ngx-cookie-service";



@Injectable({
  providedIn: "root",
})
export class AuthService {
  readonly resourceUrl = SERVER_API_URL + "/api/user/login";

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  create(login: any): Observable<any> {
    return this.http.post<any>(this.resourceUrl, login, { observe: 'response' });
  }
  setToken(token: string): void {
    this.cookieService.set('jwtToken', token, {
      expires: 10 / (24 * 60), // 10 minutes
      path: '/',
      secure: true, // Use only for HTTPS
      sameSite: 'Strict'
    });
  }


  getToken(): string {
    return this.cookieService.get('jwtToken');
  }

  deleteToken(): void {
    this.cookieService.delete('jwtToken');
  }
  checkTokenExpiration(): boolean {
    // Here you can check the token or any other logic to check token validity
    return this.getToken() !== null;
  }

}
