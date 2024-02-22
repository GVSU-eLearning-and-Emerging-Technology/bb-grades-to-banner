import { Component } from '@angular/core';
import { ConfigurationService } from '@services/configuration.service';

@Component({
	selector: 'page-footer',
	templateUrl: './page-footer.component.html',
	styleUrl: './page-footer.component.css'
})
export class PageFooterComponent {

	constructor(public configService: ConfigurationService) {}

}
