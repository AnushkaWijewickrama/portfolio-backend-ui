import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { CommonModule, NgIf } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { MatButtonModule } from "@angular/material/button";
import { ActivatedRoute } from "@angular/router";
import { ProjectService } from "../../../services/project.service";
import { Project } from "../../../models/project";
import { AngularEditorModule } from "@kolkov/angular-editor";


@Component({
  selector: "app-create-product",
  templateUrl: "./create-stack.component.html",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule, MatButtonModule, AngularEditorModule, NgIf]
})
export class CreateStackComponent implements OnInit {
  form!: FormGroup;
  product!: Project;
  imageData!: any;
  modelList: any = [];
  bannerSubscription: any;
  isedit: boolean = false;

  constructor(private projectService: ProjectService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      image: new FormControl(['/assets/imgepre.jpg'], Validators.required),
      id: new FormControl(null)
    });
    this.activatedRoute.params.subscribe((res: any) => {
      this.isedit = res['id'] ? true : false
      if (this.isedit) {
        this.projectService.getSingleData(res.id).subscribe({
          next: (res) => {
            let x = res
            this.form.get('title')?.patchValue(x.title)
            this.form.get('description')?.patchValue(x.description)
            this.form.get('id')?.patchValue(x._id)
            this.form.get('image')?.patchValue(x.image)

          },
          error: (error) => {
            console.error('Error fetching project data', error);
          }
        });
      }

    })


  }
  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file: File = input.files[0];
    this.form.patchValue({ image: file });

    const allowedMimeTypes: string[] = ["image/png", "image/jpeg", "image/jpg"];
    if (allowedMimeTypes.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageData = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }


  onSubmit() {
    if (!this.isedit) {
      this.projectService.addProject(this.form.value);
      this.form.reset();
      this.imageData = null;
    }
    else {

      this.projectService.updateSingleData(this.form.value);
      this.form.reset();
      this.imageData = null;
    }

  }
}
