import { Component, OnDestroy, computed, signal, untracked } from '@angular/core';
import { Router } from '@angular/router';
import { DataTable } from '@models/data-table.model';
import { DataService } from '@services/data.service';
import { CellValue } from '@shared/types/cell-value';
import writeXlsxFile from 'write-excel-file';
import { DateTime } from 'luxon';
import { ConfigurationService } from '@services/configuration.service';
import { NotificationService } from '@services/notification.service';
import { GradeSchema } from '@models/grade-schema.model';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-finalize-page',
	templateUrl: './finalize-page.component.html',
	styleUrl: './finalize-page.component.css',
})
export class FinalizePageComponent implements OnDestroy {
	private destroyed$ = new Subject<boolean>();

	public schemaToggle = new FormControl(false);
	public isDataDirty_ = signal(false);
	public gradeField!: string;

	public mergedData_ = computed<DataTable>(() => {
		let originalBlackboardData = this.dataService.blackboardData_()!;
		let originalBannerData = this.dataService
			.bannerData_()!
			.filterRows((row: CellValue[]): boolean => {
				return row[6] != 'W';
			});
		this.gradeField = this.dataService.blackboardGradeField_()!;
		const copyBlackboardDates = this.dataService.copyBlackboardDates_();

		// const gradeSchema: GradeSchema = this.usesCreditNoCredit_()
		// 	? this.configService.creditNoCreditGradeSchema
		// 	: this.configService.defaultGradeSchema;

		const gradeSchema = this.dataService.gradeSchema_()!;

		const neededStudentIDs = originalBannerData!.field('Student ID');
		const blackboardData = originalBlackboardData
			.filterRows((row: CellValue[]): boolean => {
				return neededStudentIDs!.includes(row[3]);
			})
			.transformFieldValues(
				this.gradeField,
				(rawGrade: CellValue): CellValue => {
					if (!!rawGrade && !!(rawGrade as string).match(/\d/)) {
						return (
							gradeSchema.gradeForPercentage(+rawGrade) ??
							''
						);
					} else {
						return rawGrade;
					}
				}
			)
			.transformFieldValues(
				'Last Access',
				(rawDate: CellValue): CellValue => {
					let dt = DateTime.fromSQL(rawDate as string);
					return dt.toFormat('LL/dd/y');
				}
			)
			.toRecords('Student ID', [this.gradeField, 'Last Access']);

		let mergedBannerData = originalBannerData
			.mergeWithRecords('Student ID', blackboardData)
			.copyFromFieldToField(
				this.gradeField,
				originalBannerData.fieldNames[6] as string
			);
		if (copyBlackboardDates) {
			mergedBannerData = mergedBannerData
				.copyFromFieldToField('Last Access', 'Last Attended Date');
		}
		return mergedBannerData!;
	});

	constructor(
		private configService: ConfigurationService,
		private dataService: DataService,
		private router: Router,
		private notificationService: NotificationService
	) { }

	ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}

	doUpdateRow(n: number, data: Record<string, string>) {
		this.mergedData_().updateCell(n, 6, data['grade']);
		this.mergedData_().updateCell(n, 7, data['lastAttendedDate']);
		this.isDataDirty_.set(true);
	}

	async doSaveBannerFile() {
		if (!!this.mergedData_()) {
			await writeXlsxFile(
				this.mergedData_()!
					.omitFields([this.gradeField, 'Last Access'])
					.exportForXslx(),
				{
					fileName: 'Import this into Banner.xlsx',
				}
			);
			this.notificationService.blue({
				message: 'Your Banner file has been downloaded and is ready to be imported.',
			});
		}
	}

	doStartOver() {
		this.dataService.clearBlackboardData();
		this.dataService.clearBannerData();
		this.router.navigate(['loader']);
	}
}
