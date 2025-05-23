import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule, FormBuilder, FormArray, AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { CommonModule, NgFor, NgIf } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { MatButtonModule } from "@angular/material/button";
import { ActivatedRoute } from "@angular/router";
import { ProjectService } from "../../../services/project.service";
import { Project } from "../../../models/project";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { StackService } from "../../../services/stack.service";
import { Stack } from "../../../models/stack";
import { Subscription } from "rxjs";


@Component({
  selector: "app-create-product",
  templateUrl: "./create-project.component.html",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgFor, HttpClientModule, MatButtonModule, AngularEditorModule, NgIf]
})
export class CreateProjectComponent implements OnInit {
  form!: FormGroup;
  product!: Project;
  imageData!: any;
  isedit: boolean = false;
  stacks: Stack[] = [];
  private stackSubscription!: Subscription;

  constructor(private projectService: ProjectService, private activatedRoute: ActivatedRoute, private fb: FormBuilder, private stackService: StackService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      image: this.fb.array([], imageArrayValidator()),
      techStack: new FormControl(null, Validators.required),
      longDescription: new FormControl(null, Validators.required),
      projectType: new FormControl(null, Validators.required),
      projectYear: new FormControl(null, Validators.required),
      projectLink: new FormControl(null, Validators.required),
      role: new FormControl(null, Validators.required),
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
            this.form.get('longDescription')?.patchValue(x.longDescription)
            this.form.get('projectYear')?.patchValue(x.projectYear)
            this.form.get('id')?.patchValue(x._id)
            this.form.get('projectType')?.patchValue(x.projectType)
            this.form.get('projectLink')?.patchValue(x.projectLink)
            this.form.get('role')?.patchValue(x.role)

            this.stackService.getstack();
            this.stackSubscription = this.stackService
              .getstackStream()
              .subscribe((stack: Stack[]) => {
                this.stacks = stack;
                const firstArray = x?.techStack
                const techArray = firstArray[0].split(',');
                const secondArray = stack
                const secondArrayTitles = secondArray.map(item => item.title);
                const commonValues = techArray.filter(value => secondArrayTitles.includes(value));
                this.form.get('techStack')?.patchValue(commonValues)

              });

            x?.imagePath?.forEach((image: string) => {
              this.image.push(this.newImage(image));
            })
          },

          error: (error) => {
            console.error('Error fetching project data', error);
          }
        });
      }
      else {
        this.stackService.getstack();
        this.stackSubscription = this.stackService
          .getstackStream()
          .subscribe((stack: Stack[]) => {
            this.stacks = stack;
          });

      }

    })


  }
  get image(): FormArray {
    return this.form.get("image") as FormArray
  }
  newImage(imagePreview?: string): FormGroup {
    return this.fb.group({
      image: [imagePreview || 'Add Project Image', Validators.required],
      imagePreview: [
        imagePreview || '/assets/imgepre.jpg',
        [Validators.required, imagePreviewValidator()] // Apply the custom validator here
      ]
    })
  }
  addImage() {
    this.image.push(this.newImage());
  }
  removeimage(i: number) {
    this.image.removeAt(i);
  }
  onFileSelect(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file: File = input.files[0];
    this.image.at(index).patchValue({ image: file });

    const allowedMimeTypes: string[] = ["image/png", "image/jpeg", "image/jpg"];
    if (allowedMimeTypes.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = (): void => {
        this.image.at(index).patchValue({ imagePreview: reader.result as string });
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
export function imageArrayValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formArray = control as FormArray;
    if (formArray && formArray.length === 0) {
      return { noImageAdded: true };
    }
    return null;
  };
}
export function imagePreviewValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === '/assets/imgepre.jpg') {
      return { invalidImagePreview: true }; // Return error if it's the default image
    }
    return null;
  };
}