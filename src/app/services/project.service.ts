import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, tap } from "rxjs/operators";
import { Observable, Subject } from "rxjs";
import { SERVER_API_URL } from "../util/common-util";
import { Router } from "@angular/router";
import { Project } from "../models/project";

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  private project: any = [];
  private project$ = new Subject<Project[]>();
  readonly projectUrl = SERVER_API_URL + "/api/project";

  constructor(private http: HttpClient, private route: Router) { }

  getProject() {
    this.http
      .get<Project>(this.projectUrl)
      .pipe(
        map((ProjectData) => {
          return ProjectData;
        })
      )
      .subscribe((Projects) => {
        this.project = Projects;
        this.project$.next(this.project);
      });
  }

  getProjectStream() {
    return this.project$.asObservable();
  }

  addProject(projectData: Project): void {
    const project = new FormData();
    project.append("title", projectData.title);
    project.append("description", projectData.description);
    project.append("longDescription", projectData.longDescription);
    project.append("projectYear", projectData.projectYear);
    project.append("projectType", projectData.projectType);
    Object.keys(projectData.image).forEach(element => {
      project.append("image", projectData.image[element].image);
    });

    this.http
      .post<Project>(this.projectUrl, project)
      .subscribe((response: any) => {
        const project: Project = {
          _id: response?._id,
          title: response?.title,
          description: response?.description,
          imagePath: response?.image,
          projectType: response?.projectType,
          projectYear: response?.projectYear,
          longDescription: response.longDescription,

        };
        this.route.navigate(['/projects'])
        this.project.push(project);

        this.project$.next(this.project);

      });
  }

  getSingleData(id: string): Observable<any> {
    return this.http.get<any>(`${this.projectUrl}/${id}`).pipe(
      map(response => {
        return response;
      })
    );
  }

  updateSingleData(data): void {
    const projectData = new FormData();
    projectData.append("title", data.title);
    if (data.image) {
      Object.keys(data.image).forEach(element => {
        projectData.append("image", data.image[element].image);
      });
    }
    projectData.append("description", data.description);
    projectData.append("longDescription", data.longDescription);
    projectData.append("projectType", data.projectType);
    projectData.append("projectYear", data.projectYear);

    this.http
      .put<{ Project: Project }>(`${this.projectUrl}/${data.id}`, projectData)
      .subscribe((Project: any) => {
        const model: Project = {
          _id: Project?._id,
          title: Project?.title,
          description: Project?.description,
          imagePath: Project?.imagePath,
          longDescription: Project?.longDescription,
          projectType: Project?.projectType,
          projectYear: Project?.projectYear
        };
        this.project.push(model);

        this.project$.next(this.project);
        this.route.navigate(['/projects'])

      });
  }
  deleteProject(projectId: string): Observable<void> {
    return this.http.delete<void>(`${this.projectUrl}/${projectId}`).pipe(
      tap(() => {
        this.project = this.project.filter((proj: Project) => proj._id !== projectId);
        this.project$.next(this.project);
      })
    );
  }

}


