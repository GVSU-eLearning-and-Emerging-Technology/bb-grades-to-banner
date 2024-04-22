import { Injectable, signal } from '@angular/core';
import { DataTable } from '@models/data-table.model';
import { GradeSchema, WhichGradeType } from '@models/grade-schema.model';

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

	setCopyBlackboardDates(b: boolean) {
		this.copyBlackboardDates_.set(b);
	}

}
