import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { BannerService } from "../../../services/banner.service";
import { Banner } from "../../../models/banner";
import { CommonModule, NgFor, NgIf } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { TableModule } from 'primeng/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from "@angular/router";
@Component({
  selector: "app-create-banner",
  templateUrl: "./all-banner.component.html",
  styleUrls: ["./all-banner.component.css"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgIf, NgFor, HttpClientModule, TableModule, MatButtonModule, RouterLink]
})
export class AllBannerComponent implements OnInit, OnDestroy {
  banner: Banner[] = [];
  private bannerSubscription!: Subscription;

  constructor(private bannersService: BannerService) { }

  ngOnInit(): void {
    this.bannersService.getBannner();
    this.bannerSubscription = this.bannersService
      .getBannerStream()
      .subscribe((banner: Banner[]) => {
        this.banner = banner;
      });
  }

  ngOnDestroy() {
    this.bannerSubscription.unsubscribe();
  }
  deleteData(id: string): void {
    if (confirm("Do you want to save the changes?") == true) {
      this.bannersService.delete(id).subscribe(res => {
        this.bannersService.getBannner();
      })
    }
  }

}
