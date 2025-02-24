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
    const deletedImages = data.deletedImages || []; // Add a field for deleted images
    const replacedImages = data.replacedImages || []; // Add a field for replaced images

    // Check if the image has been updated
    if (data.image && data.image.length > 0) {
      // Clear the existing image and append the new one
      data.image.forEach((imageObj: any) => {
        projectData.append("image", imageObj.image);
      });
    } else {
      // If image is not updated, append the existing image path
      projectData.append("imagePath", data.imagePath);
    }

    // Include deleted images and replaced images
    if (deletedImages.length > 0) {
      projectData.append("deletedImages", JSON.stringify(deletedImages));
    }
    if (replacedImages.length > 0) {
      projectData.append("replacedImages", JSON.stringify(replacedImages));
    }

    // Append other project data
    projectData.append("title", data.title);
    projectData.append("description", data.description);
    projectData.append("longDescription", data.longDescription);
    projectData.append("projectType", data.projectType);
    projectData.append("projectYear", data.projectYear);

    this.http.put<{ Project: Project }>(`${this.projectUrl}/${data.id}`, projectData).subscribe({
      next: (response: any) => {
        const updatedProject: Project = {
          _id: response?.Project?._id,
          title: response?.Project?.title,
          description: response?.Project?.description,
          imagePath: response?.Project?.imagePath,
          longDescription: response?.Project?.longDescription,
          projectType: response?.Project?.projectType,
          projectYear: response?.Project?.projectYear
        };

        // Update the project array with the new data
        const index = this.project.findIndex(project => project._id === updatedProject._id);
        if (index > -1) {
          this.project[index] = updatedProject;
        }

        this.project$.next(this.project);
        this.route.navigate(['/projects']);
      },
      error: (err) => {
        console.error('Update failed:', err);
        // Handle error (e.g., show a user-friendly message)
      }
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


