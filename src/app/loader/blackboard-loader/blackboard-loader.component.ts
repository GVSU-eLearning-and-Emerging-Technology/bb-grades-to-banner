import { Component, ElementRef, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTable } from '@models/data-table.model';
import { DataService } from '@services/data.service';
import { NotificationService } from '@services/notification.service';

@Component({
	selector: 'blackboard-loader',
	templateUrl: './blackboard-loader.component.html',
	styleUrl: './blackboard-loader.component.css'
})
export class BlackboardLoaderComponent {

	private fileInputEl_ = viewChild<ElementRef>('file');

	constructor(protected dataService: DataService, private router: Router, private notificationService: NotificationService) { }

	onChangeFile(event: any) {
		const file: File = event.target.files[0];

		const [, extension] = file.name.match(/\.(\w+)$/) ?? [];

		if (!!extension && ['txt', 'xls', 'xlsx'].includes(extension)) {

			let fr = new FileReader();
			fr.onload = () => {
				// console.debug(fr.result);
				let dataTable = new DataTable(fr.result as string);
				dataTable.setFileName(file.name);
				this.dataService.setBlackboardData(dataTable);
			}

			fr.readAsText(file);
		} else {
			this.notificationService.warning({
				title: "Whoops!",
				message: "The file you selected doesn't appear to be a Blackboard Gradebook file."
			});
			this.reset();
		}
	}

	reset() {
		this.fileInputEl_()!.nativeElement.value = "";
		this.dataService.clearBlackboardData();
	}

}
