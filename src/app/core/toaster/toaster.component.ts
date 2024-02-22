import { Component, OnDestroy } from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';
import { NotificationService, NotificationData } from '@services/notification.service';
import { Subject } from 'rxjs';

@Component({
	selector: 'toaster',
	templateUrl: './toaster.component.html',
	styleUrls: ['./toaster.component.css']
})
export class ToasterComponent implements OnDestroy {
	private destroyed$ = new Subject<boolean>();
	public toasts: NotificationData[] = [];

	constructor(private notificationService: NotificationService) {
		this.notificationService.notifications$
			.pipe(
				filter((x: NotificationData | null) => x !== null),
				takeUntil(this.destroyed$)
			)
			.subscribe((data: any) => {
				this.toasts.push(data);
			})

	}
	ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}

	doRemoveToast(id: string) {
		this.toasts = this.toasts.filter((x: NotificationData) => x.id !== id);
	}
}
