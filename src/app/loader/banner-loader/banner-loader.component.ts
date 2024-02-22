import { Component, ElementRef, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTable } from '@models/data-table.model';
import { DataService } from '@services/data.service';
import { NotificationService } from '@services/notification.service';
import { CellValue } from '@shared/types/cell-value';
import readXlsxFile from 'read-excel-file';

@Component({
  selector: 'banner-loader',
  templateUrl: './banner-loader.component.html',
  styleUrl: './banner-loader.component.css'
})
export class BannerLoaderComponent {

	private fileInputEl_ = viewChild<ElementRef>('file');


	constructor(protected dataService: DataService, private router: Router, private notificationService: NotificationService) { }

	onChangeFile(event: any) {
		const file: File = event.target.files[0];

		const [, extension] = file.name.match(/\.(\w+)$/) ?? [];

		if (!!extension && ['xlsx'].includes(extension)) {
			readXlsxFile(file).then((rawRows) => {
				let dataTable = new DataTable(rawRows as CellValue[][]);
				dataTable.setFileName(file.name);
				this.dataService.setBannerData(dataTable);

			});
		} else {
			this.notificationService.warning({
				title: "Whoops!",
				message: "The file you selected doesn't appear to be a Banner template file."
			});

			this.reset();
		}
	}

	reset() {
		this.fileInputEl_()!.nativeElement.value = "";
		this.dataService.clearBannerData();
	}


}
