import { Component, computed } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '@services/data.service';
import { CellValue } from '@shared/types/cell-value';

@Component({
	selector: 'app-grade-column-chooser-page',
	templateUrl: './grade-column-chooser-page.component.html',
	styleUrl: './grade-column-chooser-page.component.css'
})
export class GradeColumnChooserPageComponent {

	public possibleGradeFieldNames_ = computed<CellValue[]>(() => {
		let allFieldNames = this.dataService.blackboardData_()?.fieldNames ?? [];
		return allFieldNames.slice(allFieldNames.length > 6 ? 6 : 0);
	});


	constructor(private dataService: DataService, private router: Router) {}

	selectGradeColumn(fieldName: CellValue) {
		this.dataService.setBlackboardGradeField(fieldName as string);
		this.router.navigate(['finalize']);
	}

	doStartOver() {
		this.dataService.clearBlackboardData();
		this.dataService.clearBannerData();
		this.router.navigate(['loader']);
	}

}
