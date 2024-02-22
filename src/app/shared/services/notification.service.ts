import { Injectable } from '@angular/core';
import { Subject, Observable} from 'rxjs';
import { filter } from 'rxjs/operators';

import { getUuid } from '@functions/string-utils';

export interface NotificationData {
	id?: string,
	title?: string,
	message: string,
	icon?: string,
	type?: 'danger' | 'warning' | 'dark' | 'gold' | 'success' | 'blue' | undefined,
	autohide?: boolean
}

@Injectable({
	providedIn: 'root'
})
export class NotificationService {
	private notificationsSubject = new Subject<NotificationData | null>();
	public readonly _notifications$: Observable<NotificationData | null> = this.notificationsSubject.asObservable();


	constructor() { }

	get notifications$(): Observable<NotificationData | null> {
		return this._notifications$;
	}

	notify(data: NotificationData) {
		data.id = getUuid();
		data.autohide ??= true;
		this.notificationsSubject.next(data);
	}

	warning(data: Partial<NotificationData>) {
		data.type = "warning";
		data.icon ??= "fa-solid fa-triangle-exclamation fa-2x";
		this.notify(data as NotificationData);
	}

	danger(data: Partial<NotificationData>) {
		data.type = "danger";
		data.icon ??= "fa-solid fa-octagon-exclamation fa-2x";
		this.notify(data as NotificationData);
	}

	success(data: Partial<NotificationData>) {
		data.type = "success";
		this.notify(data as NotificationData);
	}

	dark(data: Partial<NotificationData>) {
		data.type = "dark";
		this.notify(data as NotificationData);
	}

	blue(data: Partial<NotificationData>) {
		data.type = "blue";
		data.icon ??= "fa-solid fa-circle-info fa-2x";
		this.notify(data as NotificationData);
	}



}
