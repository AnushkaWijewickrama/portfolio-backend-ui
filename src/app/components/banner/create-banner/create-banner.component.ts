import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from "@angular/forms";
import { Banner } from "../../../models/banner";
import { CommonModule, NgFor, NgIf } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { BannerService } from "../../../services/banner.service";
import { MatButtonModule } from "@angular/material/button";


@Component({
  selector: "app-create-banner",
  templateUrl: "./create-banner.component.html",
  styleUrls: ["./create-banner.component.css"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgIf, NgFor, HttpClientModule, MatButtonModule]
})
export class CreateBannerComponent implements OnInit {
  form!: FormGroup;
  banner!: Banner;
  imageData!: any;
  brandList: any = [];

  constructor(private profileService: BannerService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      image: new FormControl(null),
      brand: new FormControl(null),
      isVideo: new FormControl(null),
      videoPath: new FormControl(null)
    });
    this.getBrand();
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    this.form.patchValue({ image: file });
    const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (file && allowedMimeTypes.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageData = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    this.profileService.addBanner(this.form.value.title, this.form.value.image, this.form.value.description, this.form.value.isVideo, this.form.value.videoPath);
    this.form.reset();
    this.imageData = null;

  }
  getBrand(): void {
    this.profileService.query().subscribe(res => {
      this.brandList = res.body.brand
    })
  }
}
