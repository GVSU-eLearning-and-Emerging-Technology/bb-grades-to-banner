import { Injectable, signal } from '@angular/core';
import { DataTable } from '@models/data-table.model';

@Injectable({
	providedIn: 'root'
})
export class DataService {

	public blackboardData_ = signal<DataTable | null>(null);
	public bannerData_ = signal<DataTable | null>(null);

	public blackboardGradeField_ = signal<string | null>(null);
	// public usesCreditNoCredit_ = signal(false);

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

	// setUsesCreditNoCredit(b: boolean) {
	// 	this.usesCreditNoCredit_.set(b);
	// }

}
