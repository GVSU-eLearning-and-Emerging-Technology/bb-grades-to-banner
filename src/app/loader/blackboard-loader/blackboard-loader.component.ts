import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataTable } from '@models/data-table.model';
import { DataService } from '@services/data.service';

@Component({
	selector: 'blackboard-loader',
	templateUrl: './blackboard-loader.component.html',
	styleUrl: './blackboard-loader.component.css'
})
export class BlackboardLoaderComponent {

	constructor(protected dataService: DataService, private router: Router) { }

	onChangeFile(event: any) {
		const file: File = event.target.files[0];
		// TODO: Implement file type checker
		let fr = new FileReader()
		fr.onload = () => {
			// console.debug(fr.result);
			let dataTable = new DataTable(fr.result as string);
			dataTable.setFileName(file.name);
			this.dataService.setBlackboardData(dataTable);
		}

		fr.readAsText(file);
	}

}
