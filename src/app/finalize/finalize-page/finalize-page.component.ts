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
import { areGradeAndDateValid } from '@functions/grade-utils';

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
	public gradeColumnIndex_ = computed(() => {
		const whichGrade = this.dataService.whichGrade_();
		return whichGrade == "midterm" ? 6 : 7;
	});

	public mergedData_ = computed<DataTable>(() => {
		let originalBlackboardData = this.dataService.blackboardData_()!;
		const gradeColumnIndex = this.gradeColumnIndex_();


		let originalBannerData = this.dataService
			.bannerData_()!
			.filterRows((row: CellValue[]): boolean => {
				return row[gradeColumnIndex] != 'W';
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
					const re = /^Ready to Post\(([^\)]{1,2})\)/;
					if (!!rawGrade && !!(rawGrade as string).match(re)) {
						const found = (rawGrade as string).match(re);
						return <string>found![1];
					} else if (!!rawGrade && !!(rawGrade as string).match(/\d/)) {
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
			.transformFieldValues(
				'Last Attended Date',
				(rawDate: CellValue): CellValue => {
					if (!!rawDate && (typeof rawDate == "object") && ((rawDate as any).constructor.name == "Date")) {
						return DateTime.fromJSDate(rawDate).toFormat('LL/dd/y');
					} else {
						return rawDate;
					}
				}
			)
			.copyFromFieldToField(
				this.gradeField,
				originalBannerData.fieldNames[gradeColumnIndex] as string
			);
		if (!!copyBlackboardDates) {
			mergedBannerData = mergedBannerData
				.copyFromFieldToField('Last Access', 'Last Attended Date');
		}
		return mergedBannerData!;
	});

	constructor(
		private configService: ConfigurationService,
		protected dataService: DataService,
		private router: Router,
		private notificationService: NotificationService
	) { }

	ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}

	doUpdateRow(n: number, data: Record<string, string>) {
		this.mergedData_().updateCell(n, this.gradeColumnIndex_(), data['grade']);
		this.mergedData_().updateCell(n, this.gradeColumnIndex_() + 1, data['lastAttendedDate']);
		this.isDataDirty_.set(true);
	}

	async doSaveBannerFile() {
		const cannotExport = this.mergedData_().rows.some((row: CellValue[]): boolean => {
			return !areGradeAndDateValid(
				row[this.gradeColumnIndex_()] as string,
				row[this.gradeColumnIndex_() + 1] as string,
			);
		})

		if (cannotExport) {
			this.notificationService.warning({
				message: `Please provide a grade for each student and be sure that the "Last Attended Date" is provided where needed.`,
				title: "You're not ready yet!"
			});
		} else {
			if (!!this.mergedData_()) {
				await writeXlsxFile(
					this.mergedData_()!
						.omitFields([this.gradeField, 'Last Access'])
						.exportForXslx(),
					{
						fileName: `Import this into Banner (${this.dataService.courseIdentifier_()}).xlsx`,
					}
				);
				this.notificationService.blue({
					message: 'Your Banner file has been downloaded and is ready to be imported.',
				});
			}

		}
	}

	doStartOver() {
		this.dataService.clearBlackboardData();
		this.dataService.clearBannerData();
		this.router.navigate(['loader']);
	}

	// TODO: don't let the file be exported if the grade is F/I and last attendance date isn't filled in
	// TODO: add a timer to reload the page (clearing out the data) after a certain time
	// TODO: add a message on the Finalize screen to say the page will be reloaded.
	// TODO: in download toast make sure to mention they should delete the file
	// BUG: column chooser has all the metadata in it—fixed with new Bb file?
	// TODO: make sure every student has a grade entered
	// TODO: prevent download if form data is invalid
	// QUESTION: are W students supposed to appear in download file?
	// TODO: parse Blackboard file for name of downloading file

}
