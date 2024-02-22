import { Component, Signal, WritableSignal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { DataTable } from '@models/data-table.model';
import { DataService } from '@services/data.service';
import { CellValue } from '@shared/types/cell-value';
import writeXlsxFile from 'write-excel-file';
import { DateTime } from 'luxon';
import { ConfigurationService } from '@services/configuration.service';
import { NotificationService } from '@services/notification.service';

@Component({
	selector: 'app-finalize-page',
	templateUrl: './finalize-page.component.html',
	styleUrl: './finalize-page.component.css'
})
export class FinalizePageComponent {

	public gradeField: string = "";

	public mergedData_ = computed < DataTable > (() => {
		let originalBlackboardData = this.dataService.blackboardData_() !;
		let originalBannerData = this.dataService.bannerData_() !.filterRows((row: CellValue[]): boolean => {
			return row[6] != "W";
		});
		this.gradeField = this.dataService.blackboardGradeField_() !;

		const neededStudentIDs = originalBannerData!.field("Student ID");
		const blackboardData = originalBlackboardData
			.filterRows((row: CellValue[]): boolean => {
				return neededStudentIDs!.includes(row[3]);
			})
			.transformFieldValues(this.gradeField, (rawGrade: CellValue): CellValue => {
				if (!!rawGrade && !!(rawGrade as string).match(/\d/)) {
					return this.configService.defaultGradeSchema.gradeForPercentage(+rawGrade) ?? "";
				} else {
					return rawGrade;
				}
			})
			.transformFieldValues("Last Access", (rawDate: CellValue): CellValue => {
				let dt = DateTime.fromSQL(rawDate as string);
				return dt.toFormat('LL/dd/y');
			})
			.toRecords("Student ID", [this.gradeField, "Last Access"]);

		let mergedBannerData = originalBannerData
			.mergeWithRecords("Student ID", blackboardData)
			.copyFromFieldToField(this.gradeField, originalBannerData.fieldNames[6] as string)
			.copyFromFieldToField("Last Access", "Last Attended Date");

		return mergedBannerData!;
	});

	constructor(private configService: ConfigurationService, private dataService: DataService, private router: Router, private notificationService: NotificationService) {}

	doUpdateRow(n: number, data: Record < string, string > ) {
		this.mergedData_().updateCell(n, 6, data['grade']);
		this.mergedData_().updateCell(n, 7, data['lastAttendedDate']);
	}

	async doSaveBannerFile() {

		await writeXlsxFile(this.mergedData_().omitFields([this.gradeField, "Last Access"]).exportForXslx(), {
			fileName: 'Import this into Banner.xlsx'
		});
		this.notificationService.blue({
			message: "Your Banner file has been downloaded and is ready to be imported."
		});

	}

	doStartOver() {
		this.dataService.clearBlackboardData();
		this.dataService.clearBannerData();
		this.router.navigate(['loader']);
	}


}
