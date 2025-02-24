import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { SERVER_API_URL } from "../util/common-util";



@Injectable({
  providedIn: "root",
})
export class AuthService {
  readonly resourceUrl = SERVER_API_URL + "/api/user/login";

  constructor(private http: HttpClient) { }

  create(login: any): Observable<any> {
    return this.http.post<any>(this.resourceUrl, login, { observe: 'response' });
  }

}
