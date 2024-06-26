import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '@services/data.service';
import { CellValue } from '@shared/types/cell-value';
import { GradeSchemaType, WhichGradeType } from '@shared/models/grade-schema.model';
import { ConfigurationService } from '@services/configuration.service';


type State = "column" | "which" | "schema" | "dates" | "error";
type YesNo = "yes" | "no";

@Component({
	selector: 'app-grade-column-chooser-page',
	templateUrl: './grade-column-chooser-page.component.html',
	styleUrl: './grade-column-chooser-page.component.css'
})
export class GradeColumnChooserPageComponent {

	public state_ = signal<State>('column');

	public possibleGradeFieldNames_ = computed<CellValue[]>(() => {
		let allFieldNames = this.dataService.blackboardData_()?.fieldNames ?? [];
		return allFieldNames.slice(allFieldNames.length > 6 ? 6 : 0);
	});


	constructor(private dataService: DataService, private router: Router, private configService: ConfigurationService) {
		this.state_.set('column');
	}

	selectGradeColumn(fieldName: CellValue) {
		this.dataService.setBlackboardGradeField(fieldName as string);
		if (this.dataService.blackboardData_()!.field(fieldName! as string)!.some((rawGrade: CellValue) => !!rawGrade && !!(rawGrade as string).match(/\d/))) {
			this.state_.set('schema');
		} else {
			this.tryToDetectWhichGrade();
		}
	}

	tryToDetectWhichGrade() {
		if (this.dataService.bannerData_()!.hasField("Midterm Grade")) {
			this.dataService.setWhichGrade("midterm");
			this.selectCopyBlackboardDates('no');
		} else if (this.dataService.bannerData_()!.hasField("Final Grade")) {
			this.dataService.setWhichGrade("final");
			this.state_.set('dates');
		} else {
			this.state_.set('error');
		}
	}

	selectWhichGradeType(which: WhichGradeType) {
		this.dataService.setWhichGrade(which);
		this.state_.set('dates');
	}

	selectGradeSchema(type: GradeSchemaType) {
		this.dataService.setGradeSchema(
			type == "A-F"
			? this.configService.defaultGradeSchema
			: this.configService.creditNoCreditGradeSchema
		);
		this.tryToDetectWhichGrade();
	}

	selectCopyBlackboardDates(type: YesNo) {
		this.dataService.setCopyBlackboardDates(type == "yes");
		this.router.navigate(['finalize']);
	}


	doStartOver() {
		this.dataService.clearBlackboardData();
		this.dataService.clearBannerData();
		this.router.navigate(['loader']);
	}

}
