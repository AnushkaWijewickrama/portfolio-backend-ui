import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable, Subject } from "rxjs";
import { SERVER_API_URL } from "../util/common-util";
import { createRequestOption } from "../util/request-util";
import { Banner } from "../models/banner";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class BannerService {
  private banners: any = [];
  private banners$ = new Subject<Banner[]>();
  readonly url = SERVER_API_URL + "/api/banner";
  readonly bannerUrl = SERVER_API_URL + "/api/banner";

  constructor(private http: HttpClient, private route: Router) { }

  getBannner() {
    this.http
      .get<{ profiles: any }>(this.url)
      .pipe(
        map((bannerData) => {
          console.log(bannerData)
          return bannerData;
        })
      )
      .subscribe((banners) => {
        this.banners = banners;
        this.banners$.next(this.banners);
      });
  }

  getBannerStream() {
    return this.banners$.asObservable();
  }

  addBanner(title: string, image: File, description: string, isVideo: string, videoPath: string): void {
    const bannerData = new FormData();
    bannerData.append("title", title);
    bannerData.append("image", image);
    bannerData.append("description", description);
    bannerData.append("isVideo", isVideo);
    bannerData.append("videoPath", videoPath);
    // profileData.append("brand",JSON.stringify(brand));
    this.http
      .post<{ profile: Banner }>(this.bannerUrl, bannerData)
      .subscribe((bannerData: any) => {
        const banner: Banner = {
          _id: bannerData?._id,
          title: bannerData?.title,
          description: bannerData?.description,
          imagePath: bannerData?.imagePath
        };
        this.banners.push(banner);

        this.banners$.next(this.banners);
        this.route.navigate(['/banner'])
      });
  }
  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.url}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(this.url, { params: options, observe: 'response' });
  }

}
