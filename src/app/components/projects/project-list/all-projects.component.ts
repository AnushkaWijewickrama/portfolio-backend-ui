import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { CommonModule, NgFor } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HttpResponse } from "@angular/common/http";
import { ActivatedRoute, RouterLink } from "@angular/router";

import { Project } from "../../../models/project";
import { ProjectService } from "../../../services/project.service";
import { NgxPaginationModule } from "ngx-pagination";
@Component({
  selector: "app-all-product",
  templateUrl: "./all-project.component.html",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgFor, HttpClientModule, RouterLink, NgxPaginationModule]
})
export class AllProjectsComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  page: number = 1;
  private projectSubscription!: Subscription;

  constructor(private projectService: ProjectService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.projectService.getProject();
    this.projectSubscription = this.projectService
      .getProjectStream()
      .subscribe((product: Project[]) => {
        this.projects = product;
      });


  }

  ngOnDestroy() {
    this.projectSubscription.unsubscribe();
  }
  deleteData(id: string): void {
    if (confirm("Do you want to save the changes?") == true) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          console.log('Project deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting project', error);
        }
      });
    }
  }

}
