import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { CommonModule, NgFor } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HttpResponse } from "@angular/common/http";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { StackService } from "../../../services/stack.service";
import { NgxPaginationModule } from "ngx-pagination";
import { Stack } from "../../../models/stack";
@Component({
  selector: "app-all-stack",
  templateUrl: "./all-stack.component.html",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgFor, HttpClientModule, RouterLink, NgxPaginationModule]
})
export class AllStackComponent implements OnInit, OnDestroy {
  stacks: Stack[] = [];
  page: number = 1;
  private stackSubscription!: Subscription;

  constructor(private stackService: StackService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.stackService.getstack();
    this.stackSubscription = this.stackService
      .getstackStream()
      .subscribe((stack: Stack[]) => {
        this.stacks = stack;
      });


  }

  ngOnDestroy() {
    this.stackSubscription.unsubscribe();
  }
  deleteData(id: string): void {
    if (confirm("Do you want to save the changes?") == true) {
      this.stackService.deletestack(id).subscribe({
        next: () => {
          console.log('stack deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting stack', error);
        }
      });
    }
  }

}
