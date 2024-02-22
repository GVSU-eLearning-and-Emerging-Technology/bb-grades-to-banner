import { Component, Input, Output, ElementRef, ViewChild, AfterViewInit, EventEmitter } from '@angular/core';
import { from, fromEvent } from 'rxjs';

@Component({
	selector: 'toast',
	templateUrl: './toast.component.html',
	styleUrls: ['./toast.component.css']
})
export class ToastComponent implements AfterViewInit {
	@Input() id ? : string;
	@Input() title ? : string;
	@Input() message ? : string;
	@Input() icon ? : string = "fa-solid fa-triangle-exclamation";
	@Input() type ? : 'danger' | 'warning' | 'dark' | 'gold' | 'success' | 'blue' | undefined = 'dark';
	@Input() autohide ? : boolean = true;
	@Output() onHidden = new EventEmitter < string > ();
	@ViewChild('toast') toastDiv ? : ElementRef;
	private toast: any;

	constructor() {}

	ngAfterViewInit() {
		// @ts-ignore
		this.toast = new window.bootstrap.Toast(this.toastDiv!.nativeElement, {
			autohide: this.autohide
		});
		this.toast.show();

		fromEvent < any > (this.toastDiv!.nativeElement, 'hidden.bs.toast')
			.subscribe(() => {
				this.onHidden.emit(this.id);
			})

	}
}
