import { NgModule, inject } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { LoadingPageComponent } from './loading-page/loading-page.component';
import { GradeColumnChooserPageComponent } from './grade-column-chooser-page/grade-column-chooser-page.component';
import { DataService } from '@services/data.service';

const routes: Routes = [
	{
		path: 'loader',
		component: LoadingPageComponent,
		title: 'Blackboard Grades to Banner : Select Your Files'
	},
	{
		path: 'choose-column',
		component: GradeColumnChooserPageComponent,
		title: 'Blackboard Grades to Banner : Choose Your Grade Column',
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
	{ path: '**', redirectTo: 'loader', pathMatch: 'full'},
	{ path: '', redirectTo: 'loader', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoaderRoutingModule { }
