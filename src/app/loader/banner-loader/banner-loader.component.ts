import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataTable } from '@models/data-table.model';
import { DataService } from '@services/data.service';
import { CellValue } from '@shared/types/cell-value';
import readXlsxFile from 'read-excel-file';

@Component({
  selector: 'banner-loader',
  templateUrl: './banner-loader.component.html',
  styleUrl: './banner-loader.component.css'
})
export class BannerLoaderComponent {

	constructor(protected dataService: DataService, private router: Router) { }

	onChangeFile(event: any) {
		const file: File = event.target.files[0];

		readXlsxFile(file).then((rawRows) => {
			let dataTable = new DataTable(rawRows as CellValue[][]);
			dataTable.setFileName(file.name);
			this.dataService.setBannerData(dataTable);

		});
	}

}
