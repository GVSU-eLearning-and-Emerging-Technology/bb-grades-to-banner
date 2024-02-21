import { Injectable, signal } from '@angular/core';
import { DataTable } from '@models/data-table.model';

@Injectable({
	providedIn: 'root'
})
export class DataService {

	public blackboardData_ = signal<DataTable | null>(null);
	public bannerData_ = signal<DataTable | null>(null);

	public blackboardGradeField_ = signal<string | null>(null);

	constructor() {}

	setBlackboardData(data: DataTable) {
		this.blackboardData_.set(data);
	}

	setBannerData(data: DataTable) {
		this.bannerData_.set(data);
	}

	setBlackboardGradeField(fieldName: string) {
		this.blackboardGradeField_.set(fieldName);
	}

}
