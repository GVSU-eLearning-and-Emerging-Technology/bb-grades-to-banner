import { NgModule, inject } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { FinalizePageComponent } from './finalize-page/finalize-page.component';
import { DataService } from '@services/data.service';

const routes: Routes = [
	{
		path: 'finalize',
		title: 'Blackboard Grades to Banner : Finalize Your Grades',
		component: FinalizePageComponent,
		canActivate: [() => {
			const dataService = inject(DataService);
			const router = inject(Router);
			const hasBbData = (dataService.blackboardData_() !== null);
			const hasBannerData = (dataService.bannerData_() !== null);
			if (!hasBbData || !hasBannerData) {
				router.navigate(['loader']);
			}
			return hasBbData && hasBannerData;
		}],

	},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinalizeRoutingModule { }
