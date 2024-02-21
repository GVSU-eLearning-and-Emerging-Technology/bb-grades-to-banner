import { Component, effect } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '@services/data.service';

@Component({
  selector: 'app-loading-page',
  templateUrl: './loading-page.component.html',
  styleUrl: './loading-page.component.css'
})
export class LoadingPageComponent {



	constructor(private dataService: DataService, private router: Router) {
		effect(() => {
			if (!!this.dataService.blackboardData_() && !!this.dataService.bannerData_()) {
				this.router.navigate(['choose-column']);
			}
		})

	}

	// TODO: better error handling for file errors
	// TODO: restart button

}
