import { Injectable, signal } from '@angular/core';
import { DataTable } from '@models/data-table.model';
import { GradeSchema, WhichGradeType } from '@models/grade-schema.model';

export enum FilterType {
	All,
	NeedsDates,
	NeedsGrades
}

@Injectable({
	providedIn: 'root'
})
export class DataService {

	public blackboardData_ = signal<DataTable | null>(null);
	public bannerData_ = signal<DataTable | null>(null);

	public blackboardGradeField_ = signal<string | null>(null);
	public whichGrade_ = signal<WhichGradeType | null>(null);

	public gradeSchema_ = signal<GradeSchema | null>(null);
	public copyBlackboardDates_ = signal(false);

	public courseIdentifier_ = signal<string | null>(null);

	public currentFilter_ = signal<FilterType>(FilterType.All);

	public lastAttendedDateFiller_ = signal<string | null>(null);

	constructor() {}

	setBlackboardData(data: DataTable) {
		this.blackboardData_.set(data);
	}

	clearBlackboardData() {
		this.blackboardData_.set(null);
	}

	setBannerData(data: DataTable) {
		this.bannerData_.set(data);
	}

	clearBannerData() {
		this.bannerData_.set(null);
	}

	setBlackboardGradeField(fieldName: string) {
		this.blackboardGradeField_.set(fieldName);
	}

	setGradeSchema(schema: GradeSchema) {
		this.gradeSchema_.set(schema);
	}

	setWhichGrade(which: WhichGradeType) {
		this.whichGrade_.set(which);
	}

	setCourseIdentifier(which: string) {
		this.courseIdentifier_.set(which);
	}


	setCopyBlackboardDates(b: boolean) {
		this.copyBlackboardDates_.set(b);
	}

	setCurrentFilter(t: FilterType) {
		this.currentFilter_.set(t);
	}

	setLastAttendedDateFiller(t: string) {
		this.lastAttendedDateFiller_.set(t);
	}

}
