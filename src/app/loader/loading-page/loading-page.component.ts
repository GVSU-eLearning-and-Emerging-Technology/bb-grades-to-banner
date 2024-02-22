import { Component, ViewChild, effect } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '@services/data.service';
import { BlackboardLoaderComponent } from '../blackboard-loader/blackboard-loader.component';
import { BannerLoaderComponent } from '../banner-loader/banner-loader.component';

@Component({
  selector: 'app-loading-page',
  templateUrl: './loading-page.component.html',
  styleUrl: './loading-page.component.css'
})
export class LoadingPageComponent {

	@ViewChild(BlackboardLoaderComponent) blackboardLoader!: BlackboardLoaderComponent;
	@ViewChild(BannerLoaderComponent) bannerLoader!: BannerLoaderComponent;


	constructor(protected dataService: DataService, private router: Router) {
		effect(() => {
			if (!!this.dataService.blackboardData_() && !!this.dataService.bannerData_()) {
				this.router.navigate(['choose-column']);
			}
		})
	}

	doStartOver() {
		this.blackboardLoader.reset();
		this.bannerLoader.reset();
	}

}
