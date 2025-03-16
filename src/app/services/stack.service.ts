import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, tap } from "rxjs/operators";
import { Observable, Subject } from "rxjs";
import { SERVER_API_URL } from "../util/common-util";
import { Router } from "@angular/router";
import { Stack } from "../models/stack";

@Injectable({
  providedIn: "root",
})
export class StackService {
  private stack: any = [];
  private stack$ = new Subject<Stack[]>();
  readonly stackUrl = SERVER_API_URL + "/api/stack";

  constructor(private http: HttpClient, private route: Router) { }

  getstack() {
    this.http
      .get<Stack>(this.stackUrl)
      .pipe(
        map((stackData) => {
          return stackData;
        })
      )
      .subscribe((stacks) => {
        this.stack = stacks;
        this.stack$.next(this.stack);
      });
  }

  getstackStream() {
    return this.stack$.asObservable();
  }

  addstack(stackData: any): void {
    const stack = new FormData();
    stack.append("title", stackData.title);
    stack.append("description", stackData.description);
    stack.append("image", stackData.image);

    this.http
      .post<Stack>(this.stackUrl, stack)
      .subscribe((response: any) => {
        const stack: Stack = {
          _id: response?._id,
          title: response?.title,
          description: response?.description,
          imagePath: response?.imagePath,

        };
        this.route.navigate(['/stack'])
        this.stack.push(stack);

        this.stack$.next(this.stack);

      });
  }

  getSingleData(id: string): Observable<any> {
    return this.http.get<any>(`${this.stackUrl}/${id}`).pipe(
      map(response => {
        return response;
      })
    );
  }

  updateSingleData(data): void {

    const stackData = new FormData();

    stackData.append("title", data.title);
    stackData.append("description", data.description);
    stackData.append("image", data.image);

    this.http.put<{ stack: Stack }>(`${this.stackUrl}/${data.id}`, stackData).subscribe({
      next: (response: any) => {
        const updatedstack: Stack = {
          _id: response?.stack?._id,
          title: response?.stack?.title,
          description: response?.stack?.description,
          imagePath: response?.stack?.imagePath
        };
        const index = this.stack.findIndex(stack => stack._id === updatedstack._id);
        if (index > -1) {
          this.stack[index] = updatedstack;
        }

        this.stack$.next(this.stack);
        this.route.navigate(['/stack']);
      },
      error: (err) => {
        console.error('Update failed:', err);

      }
    });
  }


  deletestack(stackId: string): Observable<void> {
    return this.http.delete<void>(`${this.stackUrl}/${stackId}`).pipe(
      tap(() => {
        this.stack = this.stack.filter((proj: Stack) => proj._id !== stackId);
        this.stack$.next(this.stack);
      })
    );
  }

}


